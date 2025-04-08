import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import TodoList from "./pages/todo_list";

const App = () => {
  return (
    <div className="content">
      <BrowserRouter>
        <Routes>
          <Route path="/" index element={<Navigate to="/todo-list" />} />
          <Route path="/todo-list" index element={<TodoList />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
