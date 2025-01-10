"use client"

import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'

const PageLoader = () => {
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'authenticated' || status === 'unauthenticated') {
            setLoading(false);
        }
    }, [status]);

    if (loading) {
        return (
            <div className="page-loader">
                <div className="spinner"></div>
            </div>
        );
    }

    return null;
}

export default PageLoader