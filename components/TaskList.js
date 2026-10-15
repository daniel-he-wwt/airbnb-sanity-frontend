import { useState } from "react"

// Renders a list of tasks and lets the user delete a task by calling the
// DELETE /api/tasks/:id endpoint.
const TaskList = ({ tasks: initialTasks }) => {
  const [tasks, setTasks] = useState(initialTasks || [])
  const [deletingId, setDeletingId] = useState(null)
  const [error, setError] = useState(null)

  const handleDelete = async (id) => {
    setDeletingId(id)
    setError(null)

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || "Failed to delete task")
      }

      setTasks((currentTasks) => currentTasks.filter((task) => task._id !== id))
    } catch (err) {
      setError(err.message)
    } finally {
      setDeletingId(null)
    }
  }

  if (!tasks.length) {
    return <p>No tasks found.</p>
  }

  return (
    <div className="task-list">
      {error && <p className="task-list-error">{error}</p>}
      <ul>
        {tasks.map((task) => (
          <li key={task._id} className="task-item">
            <span>{task.title}</span>
            <button
              type="button"
              onClick={() => handleDelete(task._id)}
              disabled={deletingId === task._id}
            >
              {deletingId === task._id ? "Deleting..." : "Delete"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TaskList
