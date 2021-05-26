import { AsyncLocalStorage } from 'async_hooks';

const store = new AsyncLocalStorage();

export default store;
