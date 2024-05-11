use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct SolanaRetweet {
    pub wallet_pubkey: Pubkey,
    pub profile_pubkey: Pubkey,
    pub tweet_pubkey: Pubkey,
    pub authority: Pubkey,
    pub bump: u8,
}

impl SolanaRetweet {
    pub const SEED_PREFIX: &'static str = "retweet";

    pub fn new(
        wallet_pubkey: Pubkey,
        profile_pubkey: Pubkey,
        tweet_pubkey: Pubkey,
        authority: Pubkey,
        bump: u8,
    ) -> Self {
        SolanaRetweet {
            wallet_pubkey,
            profile_pubkey,
            tweet_pubkey,
            authority,
            bump,
        }
    }
}
