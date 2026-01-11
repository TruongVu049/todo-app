import React from 'react'

import { Card } from '@/components/ui/card/Card'
import { MESSAGES } from '@/utils/constants'

export const TodosEmpty: React.FC = () => {
  return (
    <Card className="text-center text-gray-500">{MESSAGES.TODO_EMPTY}</Card>
  )
}
