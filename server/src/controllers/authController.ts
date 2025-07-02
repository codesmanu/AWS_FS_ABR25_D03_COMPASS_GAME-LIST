import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { clerkClient } from '../config/clerk.js';

import {
  createOrUpdateUserFromClerk,
  findUserById,
} from '../services/userService.js';
import {
  isValidFullName,
  isValidEmail,
  validatePasswordRequirements,
} from '../utils/validation.js';

import { generateAppToken } from '../services/tokenService.js';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; clerkId?: string };
    }
  }
}

export async function handleClerkLoginOrRegister(req: Request, res: Response) {
  try {
    const { clerkToken } = req.body;

    if (!clerkToken) {
      return res.status(401).json({ message: 'No Clerk token provided' });
    }

    try {
      const decoded = jwt.decode(clerkToken) as { sub?: string };

      if (!decoded || !decoded.sub) {
        return res.status(401).json({ message: 'Invalid token format' });
      }

      const userId = decoded.sub;

      try {
        const clerkUser = await clerkClient.users.getUser(userId);

        const primaryEmailObj = clerkUser.emailAddresses.find(
          (email) => email.id === clerkUser.primaryEmailAddressId,
        );

        if (!primaryEmailObj) {
          return res
            .status(400)
            .json({ message: 'No primary email found for user' });
        }

        const email = primaryEmailObj.emailAddress;

        const user = await createOrUpdateUserFromClerk({
          clerkId: userId,
          email: email,
          fullName:
            clerkUser.firstName && clerkUser.lastName
              ? `${clerkUser.firstName} ${clerkUser.lastName}`
              : undefined,
        });

        const appToken = generateAppToken(user);

        return res.status(200).json({
          message: 'Login successful. Application token issued.',
          token: appToken,
          user: { id: user.id, email: user.email, fullName: user.fullName },
        });
      } catch (clerkError) {
        console.error('Error fetching Clerk user:', clerkError);
        return res.status(401).json({ message: 'Invalid Clerk user ID' });
      }
    } catch (tokenError) {
      console.error('Token processing error:', tokenError);
      return res.status(401).json({ message: 'Invalid token format' });
    }
  } catch (error) {
    console.error('Error handling Clerk login:', error);
    return res.status(500).json({
      message: 'Failed to process login.',
      error: (error as Error).message,
    });
  }
}

export async function getMyProfile(req: Request, res: Response) {
  if (!req.user || !req.user.id) {
    return res.status(401).json({
      message: 'Unauthorized: User data not found in application token.',
    });
  }

  try {
    const userProfile = await findUserById(req.user.id);

    if (!userProfile || userProfile.isDeleted) {
      return res
        .status(404)
        .json({ message: 'User profile not found or deactivated.' });
    }
    return res.status(200).json({
      id: userProfile.id,
      clerkId: userProfile.clerkId,
      email: userProfile.email,
      fullName: userProfile.fullName,
      createdAt: userProfile.createdAt,
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return res.status(500).json({ message: 'Failed to fetch profile.' });
  }
}

export async function logout(req: Request, res: Response) {
  return res.status(200).json({ message: 'Logout successful.' });
}

export async function customRegisterUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { fullName, email, password } = req.body;

    if (!isValidFullName(fullName)) {
      return res
        .status(400)
        .json({ message: 'Full Name must be at least 3 characters long.' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }

    const passwordValidation = validatePasswordRequirements(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        message: 'Password does not meet requirements.',
        errors: passwordValidation.messages,
      });
    }

    let createdClerkUser;
    try {
      const nameParts = fullName.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || undefined;

      createdClerkUser = await clerkClient.users.createUser({
        emailAddress: [email],
        password: password,
        firstName: firstName,
        lastName: lastName,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (clerkError: any) {
      if (
        clerkError.errors &&
        clerkError.errors[0]?.code === 'form_identifier_exists'
      ) {
        return res.status(409).json({
          message: 'This email address is already registered with Clerk.',
        });
      }
      console.error(
        'Clerk user creation error (API):',
        clerkError.errors || clerkError,
      );
      return res.status(500).json({
        message: 'Failed to create user account with authentication provider.',
      });
    }

    const localUser = await createOrUpdateUserFromClerk({
      clerkId: createdClerkUser.id,
      email: email,
      fullName: fullName,
    });

    return res.status(201).json({
      message: 'User registered successfully. Please log in.',
      userId: localUser.id,
      clerkId: createdClerkUser.id,
    });
  } catch (error) {
    next(error);
  }
}
