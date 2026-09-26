import { Link } from "react-router-dom";
import {
  ArrowRight,
  Compass,
  MessageCircle,
  Sparkles,
  ThumbsUp,
  Trophy,
  Users,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function App() {
  const { user } = useAuth();

  const isLoggedIn = !!user;

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              Discover. Share. Level up.
            </div>

            {isLoggedIn ? (
              <>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  Welcome back,{" "}
                  <span className="text-primary">
                    @{user.username}
                  </span>
                </h1>

                <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                  Discover what the community is talking about,
                  share your thoughts, join discussions, and earn
                  experience as you take part.
                </p>

                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <Link
                    to="/posts"
                    className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Explore posts
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    to="/posts/create"
                    className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md border bg-background px-4 py-2 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Create a post
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  Welcome to{" "}
                  <span className="text-primary">
                    QuestFeeds
                  </span>
                </h1>

                <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                  Discover interesting posts, join conversations,
                  share your ideas, and level up by taking part in
                  the community.
                </p>

                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <Link
                    to="/sign-up"
                    className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Get started
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    to="/posts"
                    className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md border bg-background px-4 py-2 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Explore QuestFeeds
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            More than just a social feed
          </h2>

          <p className="mt-4 text-muted-foreground">
            Share content, connect with other users, and earn
            experience as you contribute to the community.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Compass className="h-5 w-5" />
              </div>

              <CardTitle>Discover posts</CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-sm leading-6 text-muted-foreground">
                Browse posts from the community or search for
                content that interests you.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <MessageCircle className="h-5 w-5" />
              </div>

              <CardTitle>Join discussions</CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-sm leading-6 text-muted-foreground">
                Comment on posts and take part in conversations
                with other members of the community.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <ThumbsUp className="h-5 w-5" />
              </div>

              <CardTitle>React to posts</CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-sm leading-6 text-muted-foreground">
                Like or dislike posts and see which content is
                getting attention from the community.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Trophy className="h-5 w-5" />
              </div>

              <CardTitle>Level up</CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-sm leading-6 text-muted-foreground">
                Earn experience by creating posts, commenting,
                and interacting with the community as you level up.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              How QuestFeeds works
            </h2>

            <p className="mt-4 text-muted-foreground">
              Get involved, contribute to the community, and
              progress as you go.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-background">
                <MessageCircle className="h-6 w-6" />
              </div>

              <h3 className="font-semibold">
                1. Share and discuss
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Create posts, share your thoughts, and join
                conversations with other users.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-background">
                <ThumbsUp className="h-6 w-6" />
              </div>

              <h3 className="font-semibold">
                2. Get involved
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Comment on posts and interact with content
                across the QuestFeeds community.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-background">
                <Trophy className="h-6 w-6" />
              </div>

              <h3 className="font-semibold">
                3. Earn XP and level up
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Your activity earns experience, helping you
                progress through the QuestFeeds level system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            {isLoggedIn ? (
              <Sparkles className="h-6 w-6" />
            ) : (
              <Users className="h-6 w-6" />
            )}
          </div>

          <h2 className="text-3xl font-bold">
            {isLoggedIn
              ? "What's on your mind?"
              : "Ready to join QuestFeeds?"}
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            {isLoggedIn
              ? "Share something with the community and earn experience as you take part."
              : "Create an account to publish posts, comment, react to content, and start earning experience."}
          </p>

          <div className="mt-8">
            <Link
              to={
                isLoggedIn
                  ? "/posts/create"
                  : "/sign-up"
              }
              className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {isLoggedIn
                ? "Create a post"
                : "Create your account"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}