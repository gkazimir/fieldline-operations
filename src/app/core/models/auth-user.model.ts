/** The signed-in user for this session; there is no real identity provider yet. */
export interface AuthUser {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly role: string;
}
