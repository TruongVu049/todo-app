import { Head } from '@/components/seo'
import { TodoContainer } from '@/features/todos/todo-container'

const TodosPage = () => {
  return (
    <>
      <Head title="Todos" description="Manage your todos" />
      <TodoContainer />
    </>
  )
}

export default TodosPage
