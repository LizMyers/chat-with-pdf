'use client'

import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { useUser } from '@clerk/nextjs';
import { doc, collection } from 'firebase/firestore';
import { useDocument, useCollection } from 'react-firebase-hooks/firestore';

//number of docs user can have
const PRO_LIMIT = 20;
const FREE_LIMIT = 2;

// Limit to 20 docs
function useSubscription() {
    
    const [ hasActiveMembership, setHasActiveMembership ] = useState(null);
    const [ isOverFileLimit, setIsOverFileLimit ] = useState(false);
    const { user } = useUser();

    // Check if user has active membership
    const [ snapshot, loading, error ] = useDocument(
        user && doc(db, 'users', user.id),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

    // listen for changes to user's files
    const [ filesSnapshot, filesLoading ] = useCollection (
        user && collection(db, 'users', user?.id, 'files'),
    );

    // Check if user has active membership
    useEffect(() => {
        if (!snapshot) return;

        const data = snapshot.data();

        if (!data) return;

        setHasActiveMembership(data.activeMembership)

    }, [snapshot]);

    // Check if user is over file limit
    useEffect(() => {
        if (!filesSnapshot || hasActiveMembership === null) return;

        const files = filesSnapshot.docs;
        const usersLimit = hasActiveMembership ? PRO_LIMIT : FREE_LIMIT;

    }, [filesSnapshot, hasActiveMembership, PRO_LIMIT, FREE_LIMIT]);


    return { hasActiveMembership, isOverFileLimit, loading, error,  filesLoading };
}

export default useSubscription