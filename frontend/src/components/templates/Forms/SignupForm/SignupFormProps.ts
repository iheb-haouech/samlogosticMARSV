import { UserDTO } from "../../../../api/myApi";
export default interface SignupFormProps {
  /**
   * Sign in link
   * @type {() => void}
   * @default undefined
   */
  onSignInClick: () => void;

  /**
   * Submit button click handler
   * @type {(newUser: UserDTO) => void}
   * @default undefined
   */
  onSubmit: (newUser: UserDTO) => void;
}
