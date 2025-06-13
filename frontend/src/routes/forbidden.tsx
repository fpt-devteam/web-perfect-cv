import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/forbidden')({
  component: () => <div>Hello "/forbidden"!</div>,
})
