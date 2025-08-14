import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders sign in prompt when not authenticated", async () => {
  render(<App />);
  // Wait for redirect to /login and the sign-in UI to appear
  const text = await screen.findByText(/sign in/i);
  expect(text).toBeInTheDocument();
});
