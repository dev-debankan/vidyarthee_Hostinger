'use client'

import { useSearchParams } from 'next/navigation'
import { Button, Input, Alert } from '@/components/ui'
import { login } from './actions'

export function LoginForm() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <form action={login} className="space-y-6">
      {error && (
        <Alert variant="danger" title="Authentication Error">
          {error}
        </Alert>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-surface-700">
          Email address
        </label>
        <div className="mt-1">
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="admin@bidyarthi.org"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-surface-700">
          Password
        </label>
        <div className="mt-1">
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>
      </div>

      <div>
        <Button type="submit" className="w-full justify-center">
          Sign in
        </Button>
      </div>
    </form>
  )
}
