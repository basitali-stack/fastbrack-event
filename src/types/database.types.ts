export interface Database {
    public: {
        Tables: {
            events: {
                Row: {
                    id: string;
                    user_id: string;
                    name: string;
                    sport_type: string;
                    date_time: string;
                    description: string | null;
                    venues: string[];
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    name: string;
                    sport_type: string;
                    date_time: string;
                    description?: string | null;
                    venues?: string[];
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    name?: string;
                    sport_type?: string;
                    date_time?: string;
                    description?: string | null;
                    venues?: string[];
                    created_at?: string;
                    updated_at?: string;
                };
            };
        };
    };
}

export type Event = Database["public"]["Tables"]["events"]["Row"];
export type EventInsert = Database["public"]["Tables"]["events"]["Insert"];
export type EventUpdate = Database["public"]["Tables"]["events"]["Update"];
