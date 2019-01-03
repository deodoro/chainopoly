from random import seed, randint
import json

with open('../assets/lotr.json') as f:
    p = json.loads(f.read())

ROUNDS = 20

x = 0
y = 0
a = 0
steps = []
prop = lambda x: [i for i in p if i['position'] == x]

seed(0)
for i in range(0,ROUNDS):
   x = (x + randint(2,12)) % 40
   y = (y + randint(2,12)) % 40
   steps.append(x)
   steps.append(y)


for x in steps:
    if a == 0:
        print("")
    y = prop(x)
    if y:
        print("p%d: %d %r" % (a + 1, p.index(y[0]) + 1, y))
    else:
        print("p%d: empty" % (a + 1))
    a = 1 - a
