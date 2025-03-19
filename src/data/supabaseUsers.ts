
import { supabase } from "@/integrations/supabase/client";
import { User, UserRole } from "@/types/user";

export async function getUsersFromDB(): Promise<User[]> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      throw error;
    }

    // Transform the data to match our User type
    const users = data.map((profile: any) => ({
      id: profile.id,
      email: profile.email || '',
      firstName: profile.first_name || '',
      lastName: profile.last_name || '',
      role: profile.role as UserRole || 'customer',
      isActive: profile.is_active !== false, // Default to true if not set
      created_at: profile.created_at
    }));

    console.log('Fetched users:', users);
    return users;
  } catch (error) {
    console.error('Error in getUsersFromDB:', error);
    throw error;
  }
}

export async function updateUserRole(userId: string, role: UserRole): Promise<void> {
  try {
    console.log(`Updating user ${userId} role to ${role}`);
    const { error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId);

    if (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in updateUserRole:', error);
    throw error;
  }
}

export async function updateUserStatus(userId: string, isActive: boolean): Promise<void> {
  try {
    console.log(`Updating user ${userId} status to ${isActive ? 'active' : 'inactive'}`);
    const { error } = await supabase
      .from('profiles')
      .update({ is_active: isActive })
      .eq('id', userId);

    if (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in updateUserStatus:', error);
    throw error;
  }
}
