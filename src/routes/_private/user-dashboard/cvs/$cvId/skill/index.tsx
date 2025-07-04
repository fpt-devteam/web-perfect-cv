import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_private/user-dashboard/cvs/$cvId/skill/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_private/user-dashboard/cvs/$cvId/skill/"!</div>
}
