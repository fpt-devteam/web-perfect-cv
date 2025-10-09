import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/dashboard/payment-status')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_private/dashboard/payment-status"!</div>
}
