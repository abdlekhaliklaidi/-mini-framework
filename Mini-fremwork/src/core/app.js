import { createElement, render, createStateManager, eventManager, createRouter, eventsKey } from './framework.js';
import { FooterInfo } from './FooterInfo.js';

(function initApp() {

  if (!window.location.hash) {
    const path = window.location.pathname;
    const allowedPaths = ['/active', '/completed', '/'];

    if (allowedPaths.includes(path)) {
      window.location.replace(`/#${path}`);
    }
  }

  // const appRoot = document.createElement('section');
  // appRoot.className = 'todoapp';
  // document.body.appendChild(appRoot);

  // const state = createStateManager({ todos: [], filter: 'all' });
  const state = createStateManager({ todos: [], filter: 'all', editingId: null });
  const router = createRouter();

  let currentAppNode = null;

  function clearCompleted() {
    const todos = state.getState().todos.filter(todo => !todo.completed);
    state.setState({ todos });
    router.navigate(getPathFromFilter(state.getState().filter));
  }

  function toggleComplete(id) {
    const todos = state.getState().todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    state.setState({ todos });
  }

  function removeTodo(id) {
    const todos = state.getState().todos.filter(t => t.id !== id);
    state.setState({ todos });
  }

  // URL PATH
  function getPathFromFilter(filter) {
    return filter === 'all' ? '/' : `/${filter}`;
  }

  function updateTodoText(id, newText) {
    const todos = state.getState().todos.map(todo =>
      todo.id === id ? { ...todo, text: newText.trim() } : todo
    );
    state.setState({ todos, editingId: null });
  }

  const toggleAll = (checked) => {
    const { todos, filter } = state.getState();

    let updatedTodos;

    if (filter === 'all') {
      updatedTodos = todos.map(t => ({ ...t, completed: checked }));

    } else if (filter === 'active') {
      if (checked) {
        updatedTodos = todos.map(t => t.completed ? t : { ...t, completed: true });
      } else {
        return;
      }

    } else if (filter === 'completed') {
      if (!checked) {
        updatedTodos = todos.map(t => t.completed ? { ...t, completed: false } : t);
      } else {
        return;
      }
    }

    if (updatedTodos) {
      state.setState({ todos: updatedTodos });
    }
  };

  function TodoListComponent() {
    const { todos, filter, editingId } = state.getState();
    const filtered = todos.filter(todo => {
      if (filter === 'active') return !todo.completed;
      if (filter === 'completed') return todo.completed;
      return true;
    });

    if (filtered.length === 0) {
      return createElement('ul', { class: 'todo-list' }, [
        createElement('li', { key: 'empty' }, [])
      ]);
    }
    return createElement('ul', { class: 'todo-list' },
      filtered.map(todo => TodoItemComponent({ todo, isEditing: editingId === todo.id }))
    );
  }

  function TodoItemComponent({ todo, isEditing }) {
    let inputRef = null;

    const exitEdit = () => {
      state.setState({ editingId: null });
    };

    const handleEdit = (value) => {
      const trimmed = value.trim();

      if (trimmed === '') {
        if (inputRef) {
          inputRef.focus();
        }
        return;
      }

      if (trimmed !== todo.text) {
        updateTodoText(todo.id, trimmed);
      }
    };

    return createElement('li', {
      key: todo.id,
      class: `${todo.completed ? 'completed' : ''} ${isEditing ? 'editing' : ''}`
    }, [
      createElement('div', { class: 'view', key: 'view' }, [
        createElement('input', {
          class: 'toggle',
          type: 'checkbox',
          checked: todo.completed,
          onchange: () => toggleComplete(todo.id)
        }),
        createElement('label', {
          onclick: () => state.setState({ editingId: todo.id })
        }, [todo.text]),
        createElement('button', {
          class: 'destroy',
          onclick: () => removeTodo(todo.id)
        })
      ]),
      isEditing &&
      createElement('input', {
        key: 'edit',
        type: 'text',
        class: 'edit',
        value: todo.text,
        autofocus: true,
        oncreate: (el) => {
          inputRef = el;
          el.selectionStart = el.selectionEnd = el.value.length;
        },
        onblur: (e) => {
          exitEdit();
        },
        onkeyup: (e) => {
          if (e.key === 'Enter') {
            handleEdit(e.target.value);
          } else if (e.key === 'Escape') {
            exitEdit();
          }
        }
      })
    ].filter(Boolean));
  }

  function FooterComponent() {
    const { todos, filter } = state.getState();
    const remaining = todos.filter(t => !t.completed).length;
    const showClear = todos.some(t => t.completed);

    return createElement('footer', { class: 'footer' }, [
      createElement('span', { class: 'todo-count' }, [
        createElement('strong', {}, [remaining.toString()]),
        ` item${remaining !== 1 ? 's' : ''} left`
      ]),

      createElement('ul', { class: 'filters' }, [
        createElement('li', {}, [
          createElement('a', {
            href: '#/',
            class: filter === 'all' ? 'selected' : '',
            onclick: (e) => {
              e.preventDefault();
              router.navigate('/');
            }
          }, ['All'])
        ]),
        createElement('li', {}, [
          createElement('a', {
            href: '#/active',
            class: filter === 'active' ? 'selected' : '',
            onclick: (e) => {
              e.preventDefault();
              router.navigate('/active');
            }
          }, ['Active'])
        ]),
        createElement('li', {}, [
          createElement('a', {
            href: '#/completed',
            class: filter === 'completed' ? 'selected' : '',
            onclick: (e) => {
              e.preventDefault();
              router.navigate('/completed');
            }
          }, ['Completed'])
        ])
      ]),

      createElement('button', {
        class: 'clear-completed',
        onclick: clearCompleted,
        ...(showClear ? {} : { disabled: true })
      }, ['Clear completed']),
    ].filter(Boolean));
  }

  function AppComponent() {
    const todos = state.getState().todos;
    const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

    return createElement('section', { class: 'todoapp' }, [
      createElement('header', { class: 'header' }, [
        createElement('h1', {}, ['todos']),
        createElement('div', { class: 'input-container' }, [
          ...(todos.length > 0 ? [
            createElement('input', {
              type: 'checkbox',
              class: 'toggle-all',
              id: 'toggle-all',
              checked: allCompleted,
              onchange: (e) => toggleAll(e.target.checked)
            }),
            createElement('label', {
              htmlFor: 'toggle-all'
            }, []),
          ] : []),

          createElement('input', {
            class: 'new-todo',
            id: 'new-todo',
            placeholder: 'What needs to be done?',
            autofocus: true,
            onkeyup: function (e) {
              if (e.key === 'Enter' && this.value.trim()) {
                const newTodo = {
                  id: eventsKey(),
                  text: this.value.trim(),
                  completed: false
                };
                state.setState({ todos: [...state.getState().todos, newTodo] });
                this.value = '';
              }
            }
          }),
        ]),
      ]),
      ...(todos.length > 0 ? [
        createElement('section', { class: 'main' }, [
          TodoListComponent(),
          FooterComponent()
        ])
      ] : [])
    ]);
  }

  function renderApp() {
    const newAppNode = AppComponent();
    render(newAppNode, document.body, currentAppNode);
    currentAppNode = newAppNode._el;
  }


  state.subscribe('todos', renderApp);
  state.subscribe('filter', renderApp);
  state.subscribe('editingId', renderApp);

  router.addRoute('/', () => {
    state.setState({ filter: 'all' });
  });

  router.addRoute('/active', () => {
    state.setState({ filter: 'active' });
  });

  router.addRoute('/completed', () => {
    state.setState({ filter: 'completed' });
  });

  // Initial render
  router.navigate(window.location.hash.slice(1) || '/');
  render(FooterInfo(), document.body);
  router.initRoute();
})();
