import { fireEvent, render, screen } from "@testing-library/react";
import UserManagement from "@/pages/UserManagement";

describe("UserManagement persistence", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("persists created users across remounts", () => {
    const { unmount } = render(<UserManagement />);

    fireEvent.click(screen.getByRole("button", { name: "Add User" }));

    fireEvent.change(screen.getByLabelText("Full Name"), {
      target: { value: "Teste Persistencia" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "teste.persistencia@company.com" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Create User" }));

    expect(screen.getByText("Teste Persistencia")).toBeInTheDocument();

    unmount();

    render(<UserManagement />);

    expect(screen.getByText("Teste Persistencia")).toBeInTheDocument();
    expect(screen.getByText("teste.persistencia@company.com")).toBeInTheDocument();
  });
});
