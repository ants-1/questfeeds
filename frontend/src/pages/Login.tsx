import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
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

const formSchema = z.object({
	username: z
		.string()
		.min(1, "Username is required."),

	password: z
		.string()
		.min(1, "Password is required."),
});

type LoginFormValues = z.infer<typeof formSchema>;

export default function Login() {
	const { login } = useAuth();
	const navigate = useNavigate();

	const form = useForm<LoginFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});

	const onSubmit = async (data: LoginFormValues) => {
		try {
			await login(data.username, data.password);

			navigate("/");
		} catch (error) {
			form.setError("root", {
				message:
					error instanceof Error
						? error.message
						: "Login failed.",
			});
		}
	};

	return (
		<Card className="w-full sm:max-w-md">
			<CardHeader>
				<CardTitle>Welcome back</CardTitle>

				<CardDescription>
					Log into Questfeeds.
				</CardDescription>
			</CardHeader>

			<CardContent>
				<form
					id="login-form"
					onSubmit={form.handleSubmit(onSubmit)}
				>
					<FieldGroup>
						{/* Username */}
						<Controller
							name="username"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="login-username">
										Username
									</FieldLabel>

									<Input
										{...field}
										id="login-username"
										placeholder="johndoe"
										autoComplete="username"
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

						{/* Password */}
						<Controller
							name="password"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="login-password">
										Password
									</FieldLabel>

									<Input
										{...field}
										id="login-password"
										type="password"
										placeholder="••••••••"
										autoComplete="current-password"
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
								errors={[form.formState.errors.root]}
							/>
						)}

						<Button
							type="submit"
							className="w-full"
							disabled={form.formState.isSubmitting}
						>
							{form.formState.isSubmitting
								? "Logging in..."
								: "Log in"}
						</Button>
					</FieldGroup>
				</form>
			</CardContent>

			<CardFooter className="justify-center">
				<p className="text-sm text-muted-foreground">
					Don't have an account?{" "}
					<Link
						to="/sign-up"
						className="font-medium underline underline-offset-4"
					>
						Sign up
					</Link>
				</p>
			</CardFooter>
		</Card>
	);
}
