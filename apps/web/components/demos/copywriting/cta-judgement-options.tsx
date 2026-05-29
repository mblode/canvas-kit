"use client";

const CtaButton = ({
  children,
  variant = "primary",
}: {
  children: React.ReactNode;
  variant?: "primary" | "subtle";
}) => {
  const cls =
    variant === "primary"
      ? "rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background"
      : "rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground";
  return (
    <button type="button" className={cls}>
      {children}
    </button>
  );
};

export const LearnMoreCta = () => <CtaButton>Learn More</CtaButton>;

export const SeeHowCta = () => <CtaButton>See how it works</CtaButton>;

export const SubmitCta = () => <CtaButton>Submit</CtaButton>;

export const CreateAccountCta = () => (
  <CtaButton>Create your account, free</CtaButton>
);

export const ClickHereCta = () => <CtaButton>Click Here</CtaButton>;

export const DownloadGuideCta = () => (
  <CtaButton>Download the guide (PDF, 2MB)</CtaButton>
);
