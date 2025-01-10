
import AuthProvider from '@/app/components/SessionLayout';
import PageLoader from '../components/PageLoader';

export default function LandingLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <PageLoader />
            {children}
        </AuthProvider>
    );
}
