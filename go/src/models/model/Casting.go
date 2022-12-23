package model

type Casting struct {
    Cast *Cast
    CharacterName string
}

func NewCasting(cast *Cast, characterName string) *Casting {
    return &Casting{Cast: cast, CharacterName: characterName}
}

