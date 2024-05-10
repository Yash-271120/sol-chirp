use core::str;

use anchor_lang::prelude::*;

pub struct LikeMintMetadata {}

impl LikeMintMetadata {
    pub const TITLE: &'static str = "SolChirp Like";
    pub const SYMBOL: &'static str = "SCL";
    pub const URI: &'static str =
        "https://raw.githubusercontent.com/Yash-271120/sol-chirp/main/app_/assets/like.json";
}

#[account]
#[derive(InitSpace)]
pub struct LikeMintAuthorityPda {
    pub bump: u8,
    pub mint_bump: u8,
}

impl LikeMintAuthorityPda {
    pub const MINT_SEED_PREFIX: &'static str = "like_mint";
    pub const SEED_PREFIX: &'static str = "like_authority";

    pub fn new(bump: u8, mint_bump: u8) -> Self {
        Self { bump, mint_bump }
    }
}

pub struct RetweetMintMetadata {}

impl RetweetMintMetadata {
    pub const TITLE: &'static str = "SolChirp Retweet";
    pub const SYMBOL: &'static str = "SCR";
    pub const URI: &'static str =
        "https://raw.githubusercontent.com/Yash-271120/sol-chirp/main/app_/assets/retweet.json";
}

#[account]
#[derive(InitSpace)]
pub struct RetweetMintAuthorityPda {
    pub bump: u8,
    pub mint_bump: u8,
}

impl RetweetMintAuthorityPda {
    pub const MINT_SEED_PREFIX: &'static str = "retweet_mint";
    pub const SEED_PREFIX: &'static str = "retweet_authority";

    pub fn new(bump: u8, mint_bump: u8) -> Self {
        Self { bump, mint_bump }
    }
}