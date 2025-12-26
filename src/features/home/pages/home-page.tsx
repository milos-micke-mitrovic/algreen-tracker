export function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-12">
      <h1 className="text-4xl font-bold tracking-tight">
        Welcome to Algreen Tracker
      </h1>
      <p className="max-w-2xl text-center text-lg text-muted-foreground">
        Your React application is ready. Start building features in the{' '}
        <code className="rounded bg-muted px-2 py-1 font-mono text-sm">
          src/features
        </code>{' '}
        folder.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <FeatureCard
          title="Feature-Based Structure"
          description="Organize code by feature for better scalability"
        />
        <FeatureCard
          title="Axios + Hooks"
          description="Simple data fetching with custom hooks"
        />
        <FeatureCard
          title="Zustand"
          description="Simple and lightweight state management"
        />
        <FeatureCard
          title="React Router"
          description="Client-side routing configured"
        />
        <FeatureCard
          title="shadcn/ui"
          description="Beautiful, accessible components"
        />
        <FeatureCard
          title="TypeScript"
          description="Full type safety throughout"
        />
      </div>
    </div>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
