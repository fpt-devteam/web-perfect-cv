import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/_user/cvs/$cvId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_private/cv/$cvId"!</div>
}
