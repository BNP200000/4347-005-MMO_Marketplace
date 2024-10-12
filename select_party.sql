select p.party_name as party, p.party_balance as balance, c.character_name as leader 
from "PARTY" as p, "CHARACTERS" as c
where p.party_leader = c.character_id;