import { BibleSearchResult } from '@/models/bible';
export interface TextSearchProvider { searchText(query: string, versionId: string, limit?: number): BibleSearchResult[] }
/** Extension point for a future intent provider; this stage intentionally performs text/reference search only. */
export class SmartBibleSearch { constructor(private readonly textProvider: TextSearchProvider) {} search(query:string, versionId:string){ return this.textProvider.searchText(query,versionId,30); } }
