import { Head } from '@/components/seo'
import { TodoPage } from '@/features/new-todolist/todo-page'

const NewTodoListPage = () => {
  return (
    <>
      <Head
        title="New Todo List"
        description="A simple todo list built for the challenge"
      />
      <TodoPage />
    </>
  )
}

export default NewTodoListPage
