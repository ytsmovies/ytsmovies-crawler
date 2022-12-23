package model

type Team struct {
    Id   string
    Name string
    Homepage string
}

func NewTeam(id string, name string, homepage string) *Team {
    return &Team{Id: id, Name: name, Homepage: homepage}
}

