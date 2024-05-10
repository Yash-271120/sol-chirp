use anchor_lang::prelude::*;

#[account]
pub struct SolChirpProfile {
    pub handle: String,
    pub display_name: String,
    pub authority: Pubkey,
    pub tweet_count: u32,
    pub bump: u8,
}

impl SolChirpProfile {
    pub const SEED_PREFIX: &'static str = "profile";

    pub fn new(handle: String, display_name: String, authority: Pubkey, bump: u8) -> Self {
        return Self {
            display_name,
            authority,
            handle,
            tweet_count: 0,
            bump,
        };
    }

    pub fn get_space(handle: String, display_name: String) -> usize {
        return 8 + 4 + handle.len() + 4 + display_name.len() + 32 + 4 + 1;
    }
}
