import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";

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
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";

const profileSchema = z.object({
    username: z
        .string()
        .min(1, "Username is required.")
        .max(30, "Username must be at most 30 characters."),

    email: z.email("Please enter a valid email address."),

    avatar: z.string().optional(),

    bio: z
        .string()
        .max(200, "Bio must be at most 200 characters.")
        .optional(),
});

const passwordSchema = z
    .object({
        oldPassword: z.string().min(1, "Current password is required."),

        newPassword: z
            .string()
            .min(8, "New password must be at least 8 characters."),

        confirmPassword: z
            .string()
            .min(1, "Please confirm your new password."),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match.",
        path: ["confirmPassword"],
    });

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function Profile() {
    const { user } = useAuth();

    const {
        getUser,
        updateUser,
        updatePassword,
        isLoading,
    } = useUser();

    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);

    const profileForm = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),

        defaultValues: {
            username: "",
            email: "",
            avatar: "",
            bio: "",
        },
    });

    const passwordForm = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordSchema),

        defaultValues: {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    useEffect(() => {
        if (!user?._id) return;

        let cancelled = false;

        const loadProfile = async () => {
            try {
                const profile = await getUser(user._id);

                if (cancelled) return;

                profileForm.reset({
                    username: profile.username,
                    email: profile.email,
                    avatar: profile.avatar ?? "",
                    bio: profile.bio ?? "",
                });
            } catch (error) {
                if (cancelled) return;

                profileForm.setError("root", {
                    message:
                        error instanceof Error
                            ? error.message
                            : "Unable to load profile.",
                });
            }
        };

        loadProfile();

        return () => {
            cancelled = true;
        };
    }, [user?._id]);

    const handleProfileSubmit = async (
        data: ProfileFormValues,
    ) => {
        if (!user?._id) return;

        try {
            const updatedUser = await updateUser(
                user._id,
                data.username,
                data.email,
                data.avatar,
                data.bio,
            );

            profileForm.reset({
                username: updatedUser.username,
                email: updatedUser.email,
                avatar: updatedUser.avatar ?? "",
                bio: updatedUser.bio ?? "",
            });

            setIsEditingProfile(false);
        } catch (error) {
            profileForm.setError("root", {
                message:
                    error instanceof Error
                        ? error.message
                        : "Unable to update profile.",
            });
        }
    };

    const handlePasswordSubmit = async (
        data: PasswordFormValues,
    ) => {
        if (!user?._id) return;

        try {
            await updatePassword(
                user._id,
                data.oldPassword,
                data.newPassword,
            );

            passwordForm.reset();
            setIsEditingPassword(false);
        } catch (error) {
            passwordForm.setError("root", {
                message:
                    error instanceof Error
                        ? error.message
                        : "Unable to update password.",
            });
        }
    };

    const cancelProfileEdit = () => {
        profileForm.reset();
        profileForm.clearErrors();
        setIsEditingProfile(false);
    };

    const cancelPasswordEdit = () => {
        passwordForm.reset();
        passwordForm.clearErrors();
        setIsEditingPassword(false);
    };

    if (!user) {
        return null;
    }

    const username = profileForm.watch("username") || user.username;

    return (
        <div className="flex w-full justify-center px-4 py-8">
            <div className="w-full max-w-md space-y-6">

                {/* Profile */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                                <AvatarImage
                                    src={
                                        profileForm.watch("avatar") ||
                                        user.avatar ||
                                        undefined
                                    }
                                    alt={`${username}'s avatar`}
                                />

                                <AvatarFallback className="text-lg">
                                    {username
                                        .charAt(0)
                                        .toUpperCase()}
                                </AvatarFallback>
                            </Avatar>

                            <div>
                                <CardTitle>
                                    Your profile
                                </CardTitle>

                                <CardDescription>
                                    View and update your profile
                                    information.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <form
                            onSubmit={profileForm.handleSubmit(
                                handleProfileSubmit,
                            )}
                        >
                            <FieldGroup>

                                {/* Username */}
                                <Controller
                                    name="username"
                                    control={profileForm.control}
                                    render={({
                                        field,
                                        fieldState,
                                    }) => (
                                        <Field
                                            data-invalid={
                                                fieldState.invalid
                                            }
                                        >
                                            <FieldLabel htmlFor="profile-username">
                                                Username
                                            </FieldLabel>

                                            <Input
                                                {...field}
                                                id="profile-username"
                                                disabled={
                                                    !isEditingProfile
                                                }
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

                                {/* Email */}
                                <Controller
                                    name="email"
                                    control={profileForm.control}
                                    render={({
                                        field,
                                        fieldState,
                                    }) => (
                                        <Field
                                            data-invalid={
                                                fieldState.invalid
                                            }
                                        >
                                            <FieldLabel htmlFor="profile-email">
                                                Email
                                            </FieldLabel>

                                            <Input
                                                {...field}
                                                id="profile-email"
                                                type="email"
                                                disabled={
                                                    !isEditingProfile
                                                }
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

                                {/* Avatar URL */}
                                <Controller
                                    name="avatar"
                                    control={profileForm.control}
                                    render={({
                                        field,
                                        fieldState,
                                    }) => (
                                        <Field
                                            data-invalid={
                                                fieldState.invalid
                                            }
                                        >
                                            <FieldLabel htmlFor="profile-avatar">
                                                Avatar URL
                                            </FieldLabel>

                                            <Input
                                                {...field}
                                                id="profile-avatar"
                                                type="url"
                                                disabled={
                                                    !isEditingProfile
                                                }
                                                placeholder="https://example.com/avatar.jpg"
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

                                {/* Bio */}
                                <Controller
                                    name="bio"
                                    control={profileForm.control}
                                    render={({
                                        field,
                                        fieldState,
                                    }) => (
                                        <Field
                                            data-invalid={
                                                fieldState.invalid
                                            }
                                        >
                                            <FieldLabel htmlFor="profile-bio">
                                                Bio
                                            </FieldLabel>

                                            <Input
                                                {...field}
                                                id="profile-bio"
                                                disabled={
                                                    !isEditingProfile
                                                }
                                                placeholder="Tell us about yourself"
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
                                {profileForm.formState.errors.root && (
                                    <FieldError
                                        errors={[
                                            profileForm.formState
                                                .errors.root,
                                        ]}
                                    />
                                )}

                                {/* Buttons */}
                                {!isEditingProfile ? (
                                    <Button
                                        type="button"
                                        className="w-full"
                                        onClick={() =>
                                            setIsEditingProfile(
                                                true,
                                            )
                                        }
                                    >
                                        Update profile
                                    </Button>
                                ) : (
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="flex-1"
                                            onClick={
                                                cancelProfileEdit
                                            }
                                        >
                                            Cancel
                                        </Button>

                                        <Button
                                            type="submit"
                                            className="flex-1"
                                            disabled={
                                                profileForm
                                                    .formState
                                                    .isSubmitting ||
                                                isLoading
                                            }
                                        >
                                            {profileForm.formState
                                                .isSubmitting
                                                ? "Saving..."
                                                : "Save changes"}
                                        </Button>
                                    </div>
                                )}
                            </FieldGroup>
                        </form>
                    </CardContent>
                </Card>

                {/* Password */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Password
                        </CardTitle>

                        <CardDescription>
                            Change your account password.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        {!isEditingPassword ? (
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={() =>
                                    setIsEditingPassword(
                                        true,
                                    )
                                }
                            >
                                Change password
                            </Button>
                        ) : (
                            <form
                                onSubmit={passwordForm.handleSubmit(
                                    handlePasswordSubmit,
                                )}
                            >
                                <FieldGroup>

                                    {/* Current password */}
                                    <Controller
                                        name="oldPassword"
                                        control={
                                            passwordForm.control
                                        }
                                        render={({
                                            field,
                                            fieldState,
                                        }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <FieldLabel htmlFor="old-password">
                                                    Current password
                                                </FieldLabel>

                                                <Input
                                                    {...field}
                                                    id="old-password"
                                                    type="password"
                                                    autoComplete="current-password"
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

                                    {/* New password */}
                                    <Controller
                                        name="newPassword"
                                        control={
                                            passwordForm.control
                                        }
                                        render={({
                                            field,
                                            fieldState,
                                        }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <FieldLabel htmlFor="new-password">
                                                    New password
                                                </FieldLabel>

                                                <Input
                                                    {...field}
                                                    id="new-password"
                                                    type="password"
                                                    autoComplete="new-password"
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

                                    {/* Confirm password */}
                                    <Controller
                                        name="confirmPassword"
                                        control={
                                            passwordForm.control
                                        }
                                        render={({
                                            field,
                                            fieldState,
                                        }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <FieldLabel htmlFor="confirm-password">
                                                    Confirm new password
                                                </FieldLabel>

                                                <Input
                                                    {...field}
                                                    id="confirm-password"
                                                    type="password"
                                                    autoComplete="new-password"
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
                                    {passwordForm.formState.errors.root && (
                                        <FieldError
                                            errors={[
                                                passwordForm.formState
                                                    .errors.root,
                                            ]}
                                        />
                                    )}

                                    {/* Buttons */}
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="flex-1"
                                            onClick={
                                                cancelPasswordEdit
                                            }
                                        >
                                            Cancel
                                        </Button>

                                        <Button
                                            type="submit"
                                            className="flex-1"
                                            disabled={
                                                passwordForm
                                                    .formState
                                                    .isSubmitting ||
                                                isLoading
                                            }
                                        >
                                            {passwordForm.formState
                                                .isSubmitting
                                                ? "Saving..."
                                                : "Save password"}
                                        </Button>
                                    </div>
                                </FieldGroup>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
