export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: "buyer" | "seller" | "admin" | "agent";
          phone: string | null;
          country: string | null;
          created_at: string;
          updated_at: string;
          avatar_url: string | null;
          whatsapp: string | null;
          preferred_language: "en" | "ur";
          two_fa_enabled: boolean;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];      };
      suppliers: {
        Row: {
          id: string;
          profile_id: string;
          company_name: string;
          company_name_ur: string | null;
          slug: string;
          description: string | null;
          description_ur: string | null;
          city: string;
          cluster: string;
          category: string;
          sub_categories: string[];
          verification_tier: "unverified" | "self_declared" | "document_verified" | "site_visited" | "origino_certified";
          audit_score: number | null;
          established_year: number | null;
          employee_count: string | null;
          export_countries: string[];
          certifications: string[];
          hero_image_url: string | null;
          logo_url: string | null;
          video_url: string | null;
          moq_usd: number | null;
          lead_time_days: string | null;
          payment_terms: string[];
          response_rate: number | null;
          response_time_hours: number | null;
          health_score: number | null;
          is_active: boolean;
          is_featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["suppliers"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["suppliers"]["Insert"]>;
        Relationships: [];      };
      products: {
        Row: {
          id: string;
          supplier_id: string;
          name: string;
          name_ur: string | null;
          slug: string;
          description: string | null;
          description_ur: string | null;
          category: string;
          hs_code: string | null;
          origin_story: string | null;
          images: string[];
          price_usd_min: number | null;
          price_usd_max: number | null;
          moq: number;
          moq_unit: string;
          lead_time_days: string;
          sample_available: boolean;
          sample_price_usd: number | null;
          certifications: string[];
          specifications: Record<string, string>;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["products"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
        Relationships: [];      };
      orders: {
        Row: {
          id: string;
          buyer_id: string;
          supplier_id: string;
          product_id: string | null;
          status: "pending" | "confirmed" | "in_production" | "quality_check" | "shipped" | "delivered" | "disputed" | "cancelled";
          quantity: number;
          unit: string;
          price_usd: number;
          total_usd: number;
          currency: string;
          payment_method: "stripe" | "jazzcash" | "easypaisa" | "wire" | "escrow";
          escrow_status: "not_started" | "funded" | "released" | "disputed" | "refunded";
          tracking_number: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["orders"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
        Relationships: [];      };
      inquiries: {
        Row: {
          id: string;
          supplier_id: string;
          buyer_id: string;
          buyer_name: string;
          buyer_company: string;
          subject: string;
          message: string;
          quantity: number;
          product_id: string | null;
          status: "unread" | "read" | "replied" | "quoted";
          intent_score: number;
          replies: { id: string; author: "buyer" | "seller"; body: string; created_at: string }[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["inquiries"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["inquiries"]["Insert"]>;
        Relationships: [];      };
      quotes: {
        Row: {
          id: string;
          buyer_id: string;
          supplier_id: string;
          product_id: string | null;
          status: "pending" | "responded" | "countered" | "accepted" | "rejected" | "expired";
          quantity: number;
          unit: string;
          target_price_usd: number | null;
          offered_price_usd: number | null;
          final_price_usd: number | null;
          currency: string;
          lead_time_requested: string | null;
          lead_time_offered: string | null;
          notes: string | null;
          buyer_notes: string | null;
          expires_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["quotes"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["quotes"]["Insert"]>;
        Relationships: [];      };
      escrow_transactions: {
        Row: {
          id: string;
          order_id: string;
          amount_usd: number;
          currency: string;
          status: "pending" | "funded" | "released" | "refunded" | "disputed";
          stripe_payment_intent: string | null;
          funded_at: string | null;
          released_at: string | null;
          dispute_reason: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["escrow_transactions"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["escrow_transactions"]["Insert"]>;
        Relationships: [];      };
      inspections: {
        Row: {
          id: string;
          order_id: string;
          buyer_id: string;
          supplier_id: string;
          provider_id: string | null;
          status: "requested" | "scheduled" | "completed" | "passed" | "failed";
          scheduled_date: string | null;
          result: "pass" | "fail" | "conditional" | null;
          report_url: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["inspections"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["inspections"]["Insert"]>;
        Relationships: [];      };
      buyer_companies: {
        Row: {
          id: string;
          buyer_id: string;
          company_name: string;
          country: string;
          industry: string;
          annual_import_usd: string | null;
          vat_number: string | null;
          duns_number: string | null;
          verified: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["buyer_companies"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["buyer_companies"]["Insert"]>;
        Relationships: [];      };
      applications: {
        Row: {
          id: string;
          profile_id: string;
          full_name: string | null;
          email: string | null;
          phone: string | null;
          company_name: string;
          city: string | null;
          province: string | null;
          product_category: string | null;
          years_in_business: number | null;
          product_description: string | null;
          certifications: string | null;
          has_exported: boolean;
          export_countries: string | null;
          has_logo: boolean;
          has_website: boolean;
          has_social: boolean;
          has_photography: boolean;
          has_packaging: boolean;
          target_markets: string | null;
          production_capacity: string | null;
          hs_code: string | null;
          status: "pending" | "reviewing" | "approved" | "rejected" | "more_info";
          audit_score: number | null;
          audit_breakdown: Record<string, number> | null;
          audit_ai_feedback: string | null;
          reviewer_id: string | null;
          reviewer_notes: string | null;
          admin_notes: string | null;
          marketing_package_purchased: "basic" | "growth" | "premium" | null;
          sanctions_check_passed: boolean;
          sanctions_checked_at: string | null;
          submitted_at: string;
          reviewed_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["applications"]["Row"], "id" | "submitted_at">;
        Update: Partial<Database["public"]["Tables"]["applications"]["Insert"]>;
        Relationships: [];      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          body: string;
          link: string | null;
          read: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["notifications"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["notifications"]["Insert"]>;
        Relationships: [];      };
      community_posts: {
        Row: {
          id: string;
          author_id: string;
          title: string;
          body: string;
          category: string;
          tags: string[];
          upvotes: number;
          is_pinned: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["community_posts"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["community_posts"]["Insert"]>;
        Relationships: [];      };
      blog_posts: {
        Row: {
          id: string;
          author_id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          body: string;
          cover_image: string | null;
          tags: string[];
          published: boolean;
          published_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["blog_posts"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["blog_posts"]["Insert"]>;
        Relationships: [];      };
      saved_items: {
        Row: {
          id: string;
          user_id: string;
          item_type: "supplier" | "product" | "search";
          item_id: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["saved_items"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["saved_items"]["Insert"]>;
        Relationships: [];      };
      rfq_requests: {
        Row: {
          id: string;
          buyer_id: string;
          title: string;
          description: string;
          category: string;
          quantity: number;
          unit: string;
          target_price_usd: number | null;
          deadline: string | null;
          status: "open" | "closed" | "awarded";
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["rfq_requests"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["rfq_requests"]["Insert"]>;
        Relationships: [];      };
      awards: {
        Row: {
          id: string;
          supplier_id: string;
          category: string;
          period: string;
          rank: number;
          score: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["awards"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["awards"]["Insert"]>;
        Relationships: [];      };
      sanctions_log: {
        Row: {
          id: string;
          entity_name: string;
          entity_type: "supplier" | "buyer" | "person";
          checked_at: string;
          result: "clear" | "match" | "possible_match";
          notes: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["sanctions_log"]["Row"], "id" | "checked_at">;
        Update: Partial<Database["public"]["Tables"]["sanctions_log"]["Insert"]>;
        Relationships: [];      };
      marketing_service_orders: {
        Row: {
          id: string;
          supplier_id: string;
          tier: "basic" | "growth" | "premium";
          price_usd: number;
          status: "pending" | "paid" | "in_progress" | "delivered" | "active" | "expired" | "cancelled" | "breached";
          payment_method: "stripe" | "jazzcash" | "easypaisa" | "bank_transfer";
          local_payment_reference: string | null;
          paid_at: string | null;
          sla_due_at: string | null;
          sla_status: "on_track" | "at_risk" | "breached" | "delivered";
          assigned_to: string | null;
          delay_notes: string | null;
          starts_at: string | null;
          expires_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["marketing_service_orders"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["marketing_service_orders"]["Insert"]>;
        Relationships: [];      };
      site_config: {
        Row: {
          id: string;
          key: string;
          value: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["site_config"]["Row"], "id" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["site_config"]["Insert"]>;
        Relationships: [];      };
      page_sections: {
        Row: {
          id: string;
          page: string;
          type: string;
          order: number;
          content: Record<string, unknown>;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["page_sections"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["page_sections"]["Insert"]>;
        Relationships: [];      };
      admin_tasks: {
        Row: {
          id: string;
          title: string;
          type: "sla_breach" | "sanctions_review" | "document_expiry" | "application_review" | "manual_follow_up";
          priority: "low" | "medium" | "high" | "urgent";
          status: "open" | "in_progress" | "blocked" | "completed";
          assigned_to: string | null;
          linked_entity_type: "marketing_order" | "application" | "supplier" | "document" | "escrow";
          linked_entity_id: string;
          linked_href: string;
          due_at: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["admin_tasks"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["admin_tasks"]["Insert"]>;
        Relationships: [];      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
};

// Helper types
export type Supplier = Database["public"]["Tables"]["suppliers"]["Row"];
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type Quote = Database["public"]["Tables"]["quotes"]["Row"];
export type EscrowTransaction = Database["public"]["Tables"]["escrow_transactions"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type BuyerCompany = Database["public"]["Tables"]["buyer_companies"]["Row"];
export type Application = Database["public"]["Tables"]["applications"]["Row"];
export type CommunityPost = Database["public"]["Tables"]["community_posts"]["Row"];
export type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"];
export type Award = Database["public"]["Tables"]["awards"]["Row"];
export type PageSection = Database["public"]["Tables"]["page_sections"]["Row"];
export type MarketingServiceOrder = Database["public"]["Tables"]["marketing_service_orders"]["Row"];
export type Inquiry = Database["public"]["Tables"]["inquiries"]["Row"];
export type AdminTask = Database["public"]["Tables"]["admin_tasks"]["Row"];
export type VerificationTier = Supplier["verification_tier"];
