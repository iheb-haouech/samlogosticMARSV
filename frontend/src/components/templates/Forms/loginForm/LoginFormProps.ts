export default interface LoginFormProps {
  /**
   * Sign in link
   * @type {() => void}
   * @default undefined
   */
  onLoginClick: () => void;

  /**
   * Submit button click handler
   * @type {(email: string, password: string) => void}
   * @default undefined
   */
  onSubmit: ({ email, password }: { email: string; password: string }) => void;
}
