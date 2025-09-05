import tasksData from "@/services/mockData/tasks.json";

let tasks = [...tasksData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const taskService = {
  async getAll() {
    await delay(300);
    return [...tasks].sort((a, b) => a.position - b.position);
  },

  async getById(id) {
    await delay(200);
    const task = tasks.find(t => t.id === parseInt(id));
    return task ? { ...task } : null;
  },

  async getByListId(listId) {
    await delay(250);
    return tasks
      .filter(t => t.listId === listId)
      .sort((a, b) => a.position - b.position)
      .map(t => ({ ...t }));
  },

  async getTodayTasks() {
    await delay(250);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return tasks
      .filter(t => {
        if (!t.dueDate) return false;
        const dueDate = new Date(t.dueDate);
        return dueDate >= today && dueDate < tomorrow;
      })
      .sort((a, b) => a.position - b.position)
      .map(t => ({ ...t }));
  },

  async getUpcomingTasks() {
    await delay(250);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    return tasks
      .filter(t => {
        if (!t.dueDate) return false;
        const dueDate = new Date(t.dueDate);
        return dueDate >= tomorrow;
      })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .map(t => ({ ...t }));
  },

  async create(taskData) {
    await delay(400);
    const maxId = Math.max(...tasks.map(t => t.id), 0);
    const maxPosition = Math.max(...tasks.map(t => t.position), -1);
    
    const newTask = {
      id: maxId + 1,
      ...taskData,
      completed: false,
      completedAt: null,
      createdAt: new Date().toISOString(),
      position: maxPosition + 1
    };
    
    tasks.push(newTask);
    return { ...newTask };
  },

  async update(id, data) {
    await delay(300);
    const index = tasks.findIndex(t => t.id === parseInt(id));
    
    if (index === -1) {
      throw new Error("Task not found");
    }
    
    tasks[index] = { ...tasks[index], ...data };
    return { ...tasks[index] };
  },

  async toggleComplete(id) {
    await delay(250);
    const index = tasks.findIndex(t => t.id === parseInt(id));
    
    if (index === -1) {
      throw new Error("Task not found");
    }
    
    const wasCompleted = tasks[index].completed;
    tasks[index] = {
      ...tasks[index],
      completed: !wasCompleted,
      completedAt: !wasCompleted ? new Date().toISOString() : null
    };
    
    return { ...tasks[index] };
  },

  async delete(id) {
    await delay(200);
    const index = tasks.findIndex(t => t.id === parseInt(id));
    
    if (index === -1) {
      throw new Error("Task not found");
    }
    
    const deletedTask = tasks[index];
    tasks.splice(index, 1);
    return { ...deletedTask };
  },

  async reorderTasks(reorderedTasks) {
    await delay(250);
    
    // Update positions for all tasks
    reorderedTasks.forEach((updatedTask, index) => {
      const taskIndex = tasks.findIndex(t => t.id === updatedTask.id);
      if (taskIndex !== -1) {
        tasks[taskIndex] = { ...tasks[taskIndex], position: index };
      }
    });
    
    return reorderedTasks.map(t => ({ ...t }));
  },

  async search(query) {
    await delay(200);
    if (!query.trim()) {
      return this.getAll();
    }
    
    const searchTerm = query.toLowerCase();
    return tasks
      .filter(t => 
        t.title.toLowerCase().includes(searchTerm) ||
        (t.description && t.description.toLowerCase().includes(searchTerm))
      )
      .sort((a, b) => a.position - b.position)
      .map(t => ({ ...t }));
  }
};