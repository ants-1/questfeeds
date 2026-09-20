import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";
import { usePost } from "@/hooks/usePost";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required.")
    .max(100, "Title must be at most 100 characters."),

  content: z
    .string()
    .min(1, "Content is required.")
    .max(5000, "Content must be at most 5000 characters."),

  featureImg: z
    .string()
    .url("Please enter a valid image URL.")
    .optional()
    .or(z.literal("")),
});

type CreatePostFormValues = z.infer<typeof formSchema>;

export default function CreatePost() {
  const { user } = useAuth();
  const { createPost, isLoading } = usePost();
  const navigate = useNavigate();

  const form = useForm<CreatePostFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      featureImg: "",
    },
  });

  const onSubmit = async (data: CreatePostFormValues) => {
    if (!user?._id) return;

    try {
      const post = await createPost({
        title: data.title,
        content: data.content,
        featureImg: data.featureImg || undefined,
        author: user._id,
      });

      navigate(`/posts/${post._id}`);
    } catch (error) {
      form.setError("root", {
        message:
          error instanceof Error
            ? error.message
            : "Unable to create post.",
      });
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex w-full justify-center px-4 py-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Create a post</CardTitle>

          <CardDescription>
            Share something with the Questfeeds community.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            id="create-post-form"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FieldGroup>
              {/* Title */}
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                  >
                    <FieldLabel htmlFor="post-title">
                      Title
                    </FieldLabel>

                    <Input
                      {...field}
                      id="post-title"
                      placeholder="Enter your post title"
                      aria-invalid={fieldState.invalid}
                    />

                    {fieldState.invalid && (
                      <FieldError
                        errors={[fieldState.error]}
                      />
                    )}
                  </Field>
                )}
              />

              {/* Content */}
              <Controller
                name="content"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                  >
                    <FieldLabel htmlFor="post-content">
                      Content
                    </FieldLabel>

                    <Textarea
                      {...field}
                      id="post-content"
                      placeholder="Write your post..."
                      className="min-h-48 resize-y"
                      aria-invalid={fieldState.invalid}
                    />

                    {fieldState.invalid && (
                      <FieldError
                        errors={[fieldState.error]}
                      />
                    )}
                  </Field>
                )}
              />

              {/* Feature image */}
              <Controller
                name="featureImg"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                  >
                    <FieldLabel htmlFor="post-feature-img">
                      Feature image URL
                    </FieldLabel>

                    <Input
                      {...field}
                      id="post-feature-img"
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      aria-invalid={fieldState.invalid}
                    />

                    {fieldState.invalid && (
                      <FieldError
                        errors={[fieldState.error]}
                      />
                    )}
                  </Field>
                )}
              />

              {/* API error */}
              {form.formState.errors.root && (
                <FieldError
                  errors={[
                    form.formState.errors.root,
                  ]}
                />
              )}

              {/* Buttons */}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  className="flex-1"
                  disabled={
                    form.formState.isSubmitting ||
                    isLoading
                  }
                >
                  {form.formState.isSubmitting
                    ? "Creating..."
                    : "Create post"}
                </Button>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

