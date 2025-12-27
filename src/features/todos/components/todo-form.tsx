import * as React from 'react'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/form/input'

import type { Todo } from '../types'

const schema = z.object({
  todo: z.string().min(1, 'Please enter a todo'),
  completed: z.boolean().optional(),
  userId: z.number().optional(),
})

type Props = {
  initial?: Partial<Todo>
  onSubmit: (values: z.infer<typeof schema>) => Promise<void> | void
  onCancel?: () => void
}

export const TodoForm = ({ initial = {}, onSubmit, onCancel }: Props) => {
  const defaultValues = {
    todo: initial.todo ?? '',
    completed: initial.completed ?? false,
    userId: initial.userId ?? 1,
  }
  return (
    <Form
      schema={schema}
      onSubmit={async (values) => {
        await onSubmit(values)
      }}
      options={{ defaultValues }}
    >
      {(form) => (
        <>
          <FormItem>
            <FormLabel>Task</FormLabel>
            <FormField
              name="todo"
              control={form.control}
              render={({ field }) => (
                <FormControl>
                  <Input id="todo-input" registration={field} />
                </FormControl>
              )}
            />
            <FormDescription>Enter the task description</FormDescription>
            <FormMessage />
          </FormItem>

          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </>
      )}
    </Form>
  )
}
