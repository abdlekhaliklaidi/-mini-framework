// import { createElement, render, createStateManager, eventManager, createRouter } from './framework.js';
// import { FooterInfo } from './FooterInfo.js';

// (function initApp() {
//   const appRoot = document.getElementById('app');
//   const footerInfo = FooterInfo();  

//   if (!appRoot) {
//     console.error("appRoot not found");
//     return;
//   }

//   const state = createStateManager({ todos: [] });

//   const router = createRouter();

//   const todoApp = createElement('div', { class: 'todo-app' }, [
//     createElement('header', { class: 'header' }, [
//       createElement('h1', {}, ['TodoZONE']),
//       createElement('input', {
//         id: 'new-todo',
//         placeholder: 'What needs to be done?',
//         autofocus: true,
//         onkeyup: function (e) {
//           if (e.key === 'Enter' && this.value.trim() !== '') {
//             const todoText = this.value;
//             state.setState({
//               todos: [...state.getState().todos, { text: todoText, completed: false }]
//             });
//             this.value = '';
//           }
//         }
//       }),
//     ]),
//     createElement('section', { class: 'main' }, [
//       createElement('ul', { id: 'todo-list' }, []),
//       createElement('footer', { class: 'footer' }, [
//         createElement('span', { id: 'todo-count' }, ['0 items left']),
//         createElement('button', {
//           id: 'clear-completed',
//           onclick: clearCompleted
//         }, ['Clear Completed']),
//         createElement('button', {
//           id: 'all',
//           onclick: () => updateURL('all')
//         }, ['All']),
//         createElement('button', {
//           id: 'active',
//           onclick: () => updateURL('active')
//         }, ['Active']),
//         createElement('button', {
//           id: 'completed',
//           onclick: () => updateURL('completed')
//         }, ['Completed']),
//       ]),
//     ])
//   ]);

//   render(todoApp, appRoot);

//   function clearCompleted() {
//     const todos = state.getState().todos.filter(todo => !todo.completed);
//     state.setState({ todos });
//     router.navigate('/');
//   }

//   function updateURL(filter) {
//     const path = filter === 'all' ? '/' : `/${filter}`;
//     window.history.pushState({}, '', path);
//     router.navigate(path);
//   }

//   function toggleComplete(index) {
//     const todos = state.getState().todos.slice();
//     todos[index] = {
//       ...todos[index],
//       completed: !todos[index].completed
//     };
//     state.setState({ todos });
//   }

//   function removeTodo(index) {
//     const todos = state.getState().todos.filter((_, i) => i !== index);
//     state.setState({ todos });
//   }

//   function filterTodos(filter) {
//     const todos = state.getState().todos;
//     const todoList = document.getElementById('todo-list');
//     todoList.innerHTML = '';

//     const filtered = todos.filter(todo => {
//       if (filter === 'active') return !todo.completed;
//       if (filter === 'completed') return todo.completed;
//       return true;
//     });

//     if (filtered.length === 0) {
//       render(createElement('li', {}, ['No todos to display']), todoList);
//       return;
//     }

//     filtered.forEach((todo, index) => {
//       const li = createElement('li', {
//         class: todo.completed ? 'completed' : '',
//         id: `todo-${index}`
//       }, [
//         createElement('input', {
//           type: 'checkbox',
//           checked: todo.completed,
//           onchange: () => toggleComplete(index)
//         }),
//         createElement('label', {}, [todo.text]),
//         createElement('button', {
//           class: 'destroy',
//           onclick: () => removeTodo(index)
//         }, [])
//       ]);
//       render(li, todoList);
//     });
//   }

//   router.addRoute('/active', () => filterTodos('active'));
//   router.addRoute('/completed', () => filterTodos('completed'));
//   router.addRoute('/', () => filterTodos('all'));

//   state.subscribe(() => {
//     const todoList = document.getElementById('todo-list');
//     const todoCount = document.getElementById('todo-count');
//     const clearCompletedBtn = document.getElementById('clear-completed');

//     const todos = state.getState().todos;

//     todoList.innerHTML = '';
//     todos.forEach((todo, index) => {
//       const li = createElement('li', {
//         class: todo.completed ? 'completed' : '',
//         id: `todo-${index}`
//       }, [
//         createElement('input', {
//           type: 'checkbox',
//           checked: todo.completed,
//           onchange: () => toggleComplete(index)
//         }),
//         createElement('label', {}, [todo.text]),
//         createElement('button', {
//           class: 'destroy',
//           onclick: () => removeTodo(index)
//         }, [])
//       ]);
//       render(li, todoList);
//     });

//     const remaining = todos.filter(t => !t.completed).length;
//     todoCount.textContent = `${remaining} item${remaining !== 1 ? 's' : ''} left`;
//     clearCompletedBtn.style.display = todos.some(todo => todo.completed) ? 'block' : 'none';
//   });

//   router.navigate('/');
//   render(footerInfo, document.body);
// })();


import { createElement, render, createStateManager, eventManager, createRouter, eventsKey  } from './framework.js';
import { FooterInfo } from './FooterInfo.js';

(function initApp() {

  const appRoot = document.createElement('div');
  appRoot.id = 'app';
  document.body.appendChild(appRoot);

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
       const todos = state.getState().todos.map(t =>
         t.id === id ? { ...t, completed: !t.completed } : t
       );
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
       const todos = state.getState().todos.map(t =>
         t.id === id ? { ...t, text: newText.trim() } : t
       );
       state.setState({ todos, editingId: null });
     }

  const toggleAll = (checked) => {
  const todos = state.getState().todos.map(t => ({ ...t, completed: checked }));
  state.setState({ todos });
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
        createElement('li', { key: 'empty' }, ['No todos to display'])
      ]);
    }    

    return createElement('ul', { class: 'todo-list' },
        filtered.map(todo => TodoItemComponent({ todo, isEditing: editingId === todo.id }))
      );
  }

  function TodoItemComponent({ todo, isEditing }) {
    return createElement('li', {
      key: todo.id ?? eventsKey(),
      class: todo.completed ? 'completed' : ''
    }, [
      createElement('input', {
        type: 'checkbox',
        checked: todo.completed,
        onchange: () => toggleComplete(todo.id)
      }),
      isEditing
        ? createElement('input', {
            type: 'text',
            class: 'edit',
            value: todo.text,
            autofocus: true,
            onblur: (e) => updateTodoText(todo.id, e.target.value),
            onkeyup: (e) => {
              if (e.key === 'Enter') {
                updateTodoText(todo.id, e.target.value);
              } else if (e.key === 'Escape') {
                state.setState({ editingId: null });
              }
            }
          })
        : createElement('label', {
            ondblclick: () => state.setState({ editingId: todo.id })
          }, [todo.text]),
      createElement('button', {
        class: 'destroy',
        onclick: () => removeTodo(todo.id)
      }, ['✕']) 
    ]);
  }  

  function FooterComponent() {
    const { todos, filter } = state.getState();
    const remaining = todos.filter(t => !t.completed).length;
    const showClear = todos.some(t => t.completed);

    return createElement('footer', { class: 'footer' }, [
      createElement('span', {}, [`${remaining} item${remaining !== 1 ? 's' : ''} left`]),

      createElement('button', {
        onclick: () => router.navigate('/'),
        class: filter === 'all' ? 'selected' : ''
      }, ['All']),
      createElement('button', {
        onclick: () => router.navigate('/active'),
        class: filter === 'active' ? 'selected' : ''
      }, ['Active']),

      // createElement('button', {
      // onclick: () => eventManager.trigger('filter:change', 'active'),
      // class: filter === 'active' ? 'selected' : ''
      // }, ['Active']),

      createElement('button', {
        onclick: () => router.navigate('/completed'),
        class: filter === 'completed' ? 'selected' : ''
      }, ['Completed']),

      showClear ? createElement('button', {
        onclick: clearCompleted
      }, ['Clear Completed']) : null,
    ].filter(Boolean));
  }

  function AppComponent() {
    const todos = state.getState().todos;
    const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);
  
    return createElement('div', { class: 'todo-app' }, [
      createElement('header', { class: 'header' }, [
        createElement('h1', {}, ['todos']),
        createElement('div', { class: 'input-wrapper' }, [
        createElement('input', {
          type: 'checkbox',
          class: 'toggle-all',
          id: 'toggle-all',
          checked: allCompleted,
          onchange: (e) => toggleAll(e.target.checked)
        }),
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
      createElement('section', { class: 'main' }, [
        TodoListComponent(),
        FooterComponent()
      ])
    ]);
  }  

  function renderApp() {
    const newAppNode = AppComponent();
    render(newAppNode, appRoot, currentAppNode);
    currentAppNode = newAppNode._el; // Save DOM reference for next render
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
  router.navigate(window.location.pathname);
  render(FooterInfo(), document.body);
  router.initRoute();
})();
