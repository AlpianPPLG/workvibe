import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { InviteMemberForm } from '@/components/MembersComponent/InviteMemberForm';
import type { BaseMember } from '@/types/common';

describe('InviteMemberForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();
  const existingMembers: BaseMember[] = [
    { 
      id: '1', 
      email: 'existing@example.com', 
      name: 'Existing User',
      role: 'member',
      status: 'active',
      lastActive: new Date().toISOString()
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the form with all fields', () => {
    render(
      <InviteMemberForm
        existingMembers={existingMembers}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={false}
      />
    );

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/role/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send invitation/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('shows validation errors when form is submitted empty', async () => {
    render(
      <InviteMemberForm
        existingMembers={existingMembers}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={false}
      />
    );

    const submitButton = screen.getByRole('button', { name: /send invitation/i });
    await userEvent.click(submitButton);

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('shows error for invalid email format', async () => {
    render(
      <InviteMemberForm
        existingMembers={existingMembers}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={false}
      />
    );

    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByRole('button', { name: /send invitation/i });

    await userEvent.type(emailInput, 'invalid-email');
    await userEvent.click(submitButton);

    expect(await screen.findByText(/must be a valid email/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('shows error for existing email', async () => {
    render(
      <InviteMemberForm
        existingMembers={existingMembers}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={false}
      />
    );

    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByRole('button', { name: /send invitation/i });

    await userEvent.type(emailInput, 'existing@example.com');
    await userEvent.click(submitButton);

    expect(await screen.findByText(/member with this email already exists/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits the form with valid data', async () => {
    render(
      <InviteMemberForm
        existingMembers={existingMembers}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={false}
      />
    );

    const testEmail = 'test@example.com';
    
    await userEvent.type(screen.getByLabelText(/email address/i), testEmail);
    await userEvent.click(screen.getByRole('combobox', { name: /role/i }));
    await userEvent.click(screen.getByText('Member'));
    
    const submitButton = screen.getByRole('button', { name: /send invitation/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: testEmail,
        role: 'member',
      });
    });
  });

  it('calls onCancel when cancel button is clicked', async () => {
    render(
      <InviteMemberForm
        existingMembers={existingMembers}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={false}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await userEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('disables the submit button when loading', () => {
    render(
      <InviteMemberForm
        existingMembers={existingMembers}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={true}
      />
    );

    const submitButton = screen.getByRole('button', { name: /send invitation/i });
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent(/sending/i);
  });
});
