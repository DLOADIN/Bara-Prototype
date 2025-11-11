import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Mail, 
  Phone, 
  Building, 
  Star, 
  CheckCircle,
  Verified
} from 'lucide-react';

export interface VerificationStatus {
  email?: boolean;
  phone?: boolean;
  business?: boolean;
  trusted_organizer?: boolean;
}

interface VerificationBadgeProps {
  verification: VerificationStatus;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  verification,
  size = 'md',
  showText = true,
  className = ''
}) => {
  // Determine the highest verification level
  const getVerificationLevel = (): {
    level: string;
    icon: React.ReactNode;
    label: string;
    color: string;
  } => {
    if (verification.trusted_organizer) {
      return {
        level: 'trusted_organizer',
        icon: <Star className={getIconSize()} />,
        label: 'Trusted Organizer',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-300'
      };
    }
    
    if (verification.business) {
      return {
        level: 'business',
        icon: <Building className={getIconSize()} />,
        label: 'Verified Business',
        color: 'bg-purple-100 text-purple-800 border-purple-300'
      };
    }
    
    if (verification.phone) {
      return {
        level: 'phone',
        icon: <Phone className={getIconSize()} />,
        label: 'Phone Verified',
        color: 'bg-blue-100 text-blue-800 border-blue-300'
      };
    }
    
    if (verification.email) {
      return {
        level: 'email',
        icon: <Mail className={getIconSize()} />,
        label: 'Email Verified',
        color: 'bg-green-100 text-green-800 border-green-300'
      };
    }
    
    return {
      level: 'none',
      icon: <Shield className={getIconSize()} />,
      label: 'Unverified',
      color: 'bg-gray-100 text-gray-600 border-gray-300'
    };
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm': return 'h-3 w-3';
      case 'lg': return 'h-5 w-5';
      default: return 'h-4 w-4';
    }
  };

  const getBadgeSize = () => {
    switch (size) {
      case 'sm': return 'text-xs px-1.5 py-0.5';
      case 'lg': return 'text-sm px-3 py-1';
      default: return 'text-xs px-2 py-1';
    }
  };

  const verificationInfo = getVerificationLevel();
  
  // Don't show badge for unverified users
  if (verificationInfo.level === 'none') {
    return null;
  }

  return (
    <Badge 
      variant="outline" 
      className={`
        ${verificationInfo.color} 
        ${getBadgeSize()} 
        inline-flex items-center gap-1 font-medium border
        ${className}
      `}
    >
      {verificationInfo.icon}
      {showText && <span>{verificationInfo.label}</span>}
    </Badge>
  );
};

// Simple verification check icon component
export const VerificationIcon: React.FC<{
  verification: VerificationStatus;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ verification, size = 'md', className = '' }) => {
  const iconSize = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5';
  
  if (verification.trusted_organizer) {
    return <Star className={`${iconSize} text-yellow-500 ${className}`} />;
  }
  
  if (verification.business) {
    return <Building className={`${iconSize} text-purple-500 ${className}`} />;
  }
  
  if (verification.phone) {
    return <CheckCircle className={`${iconSize} text-blue-500 ${className}`} />;
  }
  
  if (verification.email) {
    return <Verified className={`${iconSize} text-green-500 ${className}`} />;
  }
  
  return null;
};

// Multi-verification badges component
export const VerificationBadges: React.FC<{
  verification: VerificationStatus;
  size?: 'sm' | 'md' | 'lg';
  maxDisplay?: number;
  className?: string;
}> = ({ verification, size = 'sm', maxDisplay = 3, className = '' }) => {
  const badges: Array<{ type: keyof VerificationStatus; icon: React.ReactNode; label: string; color: string }> = [];
  
  if (verification.email) {
    badges.push({
      type: 'email',
      icon: <Mail className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />,
      label: '✓ Email',
      color: 'bg-green-100 text-green-700'
    });
  }
  
  if (verification.phone) {
    badges.push({
      type: 'phone',
      icon: <Phone className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />,
      label: '✓ Phone',
      color: 'bg-blue-100 text-blue-700'
    });
  }
  
  if (verification.business) {
    badges.push({
      type: 'business',
      icon: <Building className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />,
      label: '✓ Business',
      color: 'bg-purple-100 text-purple-700'
    });
  }
  
  if (verification.trusted_organizer) {
    badges.push({
      type: 'trusted_organizer',
      icon: <Star className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />,
      label: '⭐ Trusted',
      color: 'bg-yellow-100 text-yellow-700'
    });
  }
  
  const displayBadges = badges.slice(0, maxDisplay);
  const remainingCount = badges.length - maxDisplay;
  
  if (displayBadges.length === 0) {
    return null;
  }
  
  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {displayBadges.map((badge) => (
        <Badge 
          key={badge.type}
          variant="outline" 
          className={`
            ${badge.color} 
            ${size === 'sm' ? 'text-xs px-1.5 py-0.5' : 'text-xs px-2 py-1'}
            inline-flex items-center gap-1 font-medium border
          `}
        >
          {badge.icon}
          <span>{badge.label}</span>
        </Badge>
      ))}
      
      {remainingCount > 0 && (
        <Badge 
          variant="outline" 
          className={`
            bg-gray-100 text-gray-600
            ${size === 'sm' ? 'text-xs px-1.5 py-0.5' : 'text-xs px-2 py-1'}
          `}
        >
          +{remainingCount}
        </Badge>
      )}
    </div>
  );
};