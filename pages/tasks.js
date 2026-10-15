import { sanityClient } from "../sanity"
import TaskList from "../components/TaskList"

const Tasks = ({ tasks }) => {
  return (
    <div className="main">
      <h1>Tasks</h1>
      <TaskList tasks={tasks} />
    </div>
  )
}

export const getServerSideProps = async () => {
  const query = '*[_type == "task"]'
  const tasks = await sanityClient.fetch(query)

  return {
    props: {
      tasks: tasks || [],
    },
  }
}

export default Tasks
