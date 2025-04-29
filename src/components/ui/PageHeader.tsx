
import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

const PageHeader = ({ title, description, children }: PageHeaderProps) => {
  return (
    <div className="bg-gray-50 border-b border-gray-200 py-12 mb-8">
      <div className="container mx-auto px-4 md:px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          {title}
        </h1>
        {description && (
          <p className="text-gray-600 max-w-3xl">{description}</p>
        )}
        {children}
      </div>
    </div>
  );
};

export default PageHeader;
