package model

type Queue struct {
    data []interface{}
    size int
}

func NewQueue() *Queue {
    return &Queue{ make([]interface{}, 0), 0}
}

func (q *Queue) Push(item interface{}) *Queue {
    q.data = append(q.data, item)
    q.size++
    return q
}

func (q *Queue) Pop() interface{} {
    if !q.IsEmpty() {
        item := q.data[0]
        q.data = q.data[1:q.size]
        q.size--
        return item
    }
    return nil
}

func (q *Queue) Front() interface{} {
    if !q.IsEmpty() {
        return q.data[0]
    }
    return nil
}

func (q *Queue) IsEmpty() bool {
    return q.size == 0
}

func (q *Queue) Clear() {
    q.data = make([]interface{}, 0)
    q.size = 0
}

func (q *Queue) Size() int {
    return q.size
}