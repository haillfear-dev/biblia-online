import { useCallback, useEffect, useState } from 'react';
import { UserBibleData, userBibleStorage } from '@/storage/UserBibleStorage';
const initial: UserBibleData = { favorites: [], highlights: [], notes: [], progress: null, history: [] };
export function useUserBibleData() { const [data, setData] = useState(initial); const [loading, setLoading] = useState(true); const refresh = useCallback(async () => { setData(await userBibleStorage.getAll()); setLoading(false); }, []); useEffect(() => { void refresh(); }, [refresh]); return { data, loading, refresh, setData }; }
