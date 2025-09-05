import taskListsData from "@/services/mockData/taskLists.json";

let taskLists = [...taskListsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const taskListService = {
  async getAll() {
    await delay(200);
    return [...taskLists].sort((a, b) => a.position - b.position);
  },

  async getById(id) {
    await delay(150);
    const list = taskLists.find(l => l.id === id);
    return list ? { ...list } : null;
  },

  async create(listData) {
    await delay(300);
    const maxPosition = Math.max(...taskLists.map(l => l.position), -1);
    
    const newList = {
      id: Date.now().toString(),
      ...listData,
      position: maxPosition + 1,
      taskCount: 0
    };
    
    taskLists.push(newList);
    return { ...newList };
  },

  async update(id, data) {
    await delay(250);
    const index = taskLists.findIndex(l => l.id === id);
    
    if (index === -1) {
      throw new Error("List not found");
    }
    
    taskLists[index] = { ...taskLists[index], ...data };
    return { ...taskLists[index] };
  },

  async delete(id) {
    await delay(200);
    const index = taskLists.findIndex(l => l.id === id);
    
    if (index === -1) {
      throw new Error("List not found");
    }
    
    const deletedList = taskLists[index];
    taskLists.splice(index, 1);
    return { ...deletedList };
  },

  async updateTaskCount(id, count) {
    await delay(100);
    const index = taskLists.findIndex(l => l.id === id);
    
    if (index !== -1) {
      taskLists[index] = { ...taskLists[index], taskCount: count };
      return { ...taskLists[index] };
    }
    
    return null;
  }
};