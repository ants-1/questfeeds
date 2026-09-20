import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";

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
    .max(
      100,
      "Title must be at most 100 characters.",
    ),

  content: z
    .string()
    .min(1, "Content is required.")
    .max(
      5000,
      "Content must be at most 5000 characters.",
    ),

  featureImg: z
    .string()
    .url("Please enter a valid image URL.")
    .optional()
    .or(z.literal("")),
});

type EditPostFormValues =
  z.infer<typeof formSchema>;

export default function EditPost() {
  const { user } = useAuth();

  const {
    posts,
    updatePost,
    isLoading,
  } = usePost();

  const navigate = useNavigate();

  const { id } = useParams<{
    id: string;
  }>();

  const form =
    useForm<EditPostFormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        title: "",
        content: "",
        featureImg: "",
      },
    });

  /*
   * Find the post
   */
  const post = posts.find(
    (post) => post._id === id,
  );

  /*
   * Populate form with existing post
   */
  useEffect(() => {
    if (!post) return;

    form.reset({
      title: post.title,
      content: post.content,
      featureImg: post.featureImg ?? "",
    });
  }, [post, form]);

  /*
   * Submit
   */
  const onSubmit = async (
    data: EditPostFormValues,
  ) => {
    if (!user?._id || !id) return;

    try {
      const updatedPost = await updatePost(id, {
        title: data.title,
        content: data.content,
        featureImg: data.featureImg || undefined,
        author: user._id,
      });

      navigate(
        `/posts/${updatedPost._id}`,
      );
    } catch (error) {
      form.setError("root", {
        message:
          error instanceof Error
            ? error.message
            : "Unable to update post.",
      });
    }
  };

  if (!user) {
    return null;
  }

  if (!id) {
    return (
      <div className="flex w-full justify-center px-4 py-8">
        <Card className="w-full max-w-2xl">
          <CardContent className="py-8">
            <p className="text-sm text-destructive">
              Post ID is missing.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex w-full justify-center px-4 py-8">
        <Card className="w-full max-w-2xl">
          <CardContent className="py-8">
            <p className="text-sm text-muted-foreground">
              Post not found.
            </p>

            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={() =>
                navigate("/posts")
              }
            >
              Back to posts
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  /*
   * Make sure only the author can edit
   */
  const authorId =
    typeof post.author === "string"
      ? post.author
      : post.author._id;

  if (authorId !== user._id) {
    return (
      <div className="flex w-full justify-center px-4 py-8">
        <Card className="w-full max-w-2xl">
          <CardContent className="py-8">
            <p className="text-sm text-destructive">
              You can only edit your own posts.
            </p>

            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={() =>
                navigate(
                  `/posts/${post._id}`,
                )
              }
            >
              Back to post
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex w-full justify-center px-4 py-8">
      <Card className="w-full max-w-2xl">

        <CardHeader>
          <CardTitle>
            Edit post
          </CardTitle>

          <CardDescription>
            Update your post.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            id="edit-post-form"
            onSubmit={form.handleSubmit(
              onSubmit,
            )}
          >
            <FieldGroup>

              {/* Title */}
              <Controller
                name="title"
                control={form.control}
                render={({
                  field,
                  fieldState,
                }) => (
                  <Field
                    data-invalid={
                      fieldState.invalid
                    }
                  >
                    <FieldLabel htmlFor="post-title">
                      Title
                    </FieldLabel>

                    <Input
                      {...field}
                      id="post-title"
                      placeholder="Enter your post title"
                      aria-invalid={
                        fieldState.invalid
                      }
                    />

                    {fieldState.invalid && (
                      <FieldError
                        errors={[
                          fieldState.error,
                        ]}
                      />
                    )}
                  </Field>
                )}
              />

              {/* Content */}
              <Controller
                name="content"
                control={form.control}
                render={({
                  field,
                  fieldState,
                }) => (
                  <Field
                    data-invalid={
                      fieldState.invalid
                    }
                  >
                    <FieldLabel htmlFor="post-content">
                      Content
                    </FieldLabel>

                    <Textarea
                      {...field}
                      id="post-content"
                      placeholder="Write your post..."
                      className="min-h-48 resize-y"
                      aria-invalid={
                        fieldState.invalid
                      }
                    />

                    {fieldState.invalid && (
                      <FieldError
                        errors={[
                          fieldState.error,
                        ]}
                      />
                    )}
                  </Field>
                )}
              />

              {/* Feature image */}
              <Controller
                name="featureImg"
                control={form.control}
                render={({
                  field,
                  fieldState,
                }) => (
                  <Field
                    data-invalid={
                      fieldState.invalid
                    }
                  >
                    <FieldLabel htmlFor="post-feature-img">
                      Feature image URL
                    </FieldLabel>

                    <Input
                      {...field}
                      id="post-feature-img"
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      aria-invalid={
                        fieldState.invalid
                      }
                    />

                    {fieldState.invalid && (
                      <FieldError
                        errors={[
                          fieldState.error,
                        ]}
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
                  onClick={() =>
                    navigate(-1)
                  }
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  className="flex-1"
                  disabled={
                    form.formState
                      .isSubmitting ||
                    isLoading
                  }
                >
                  {form.formState
                    .isSubmitting
                    ? "Updating..."
                    : "Update post"}
                </Button>

              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}