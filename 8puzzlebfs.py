import copy
from graphviz import Digraph 
tree = Digraph(comment = 'Tree Hierarchy')
import time
goalStateData = [
    [8, 6, 3],
    [2, 7, 4],
    [0, 1, 5],
]

initialState = {
    "data": [[8,6,3], [2,0,4], [1,7,5]],
    "isRecursive": False,
    "isGoal": False,
    "level": 0,
    "id": 1,
    "parentId": '',
    "action": '',
};

reachedGoal = False

countNode = 1
stateSpaceTree = [[copy.deepcopy(initialState)]]
currentLevel = 0

tempChildren = []
def find_zero(state):
    for i, row in enumerate(state):
        for j, col in enumerate(row):
            if col == 0:
                return i, j
# a = find_zero(initialState.get("data"))
#print(a[1])
def checkRecursive(newData, currentArray):
    global stateSpaceTree
    for state in stateSpaceTree:
        for item in state:
            if item["data"] == newData:
                return True

    for item in currentArray:
        if item["data"] == newData:
            return True

    return False

def checkGoalState(data):
    return data == goalStateData
# a= checkGoalState(initialState.get("data"))
# print(a)

def performAction(state, i, j, action):
    global reachedGoal
    global countNode
    newState = copy.deepcopy(state)
    newData = copy.deepcopy(newState["data"])
    if action == 'u' and i > 0:
        newData[i][j], newData[i - 1][j] = newData[i - 1][j], 0
    elif action == 'l' and j > 0:
        newData[i][j], newData[i][j - 1] = newData[i][j - 1], 0
    elif action == 'd' and i < 2:
        newData[i][j], newData[i + 1][j] = newData[i + 1][j], 0
    elif action == 'r' and j < 2:
        newData[i][j], newData[i][j + 1] = newData[i][j + 1], 0
    if checkRecursive(newData, tempChildren):
        newState["isRecursive"] = True
        # return False
    newState["data"] = newData
    newState["action"] = action
    newState["parentId"] = state["id"]
    countNode = countNode + 1
    newState["id"] = countNode
    newState["level"] = state["level"] + 1
    tempChildren.append(newState)
    
    if checkGoalState(newData):
        newState["isGoal"] = True
        print("Goal State Achieved at id " + str(newState["id"]))
        reachedGoal = True
        return True
    return False

def stateSpaceSearch():

    global reachedGoal
    global countNode
    global stateSpaceTree
    global tempChildren

    while not reachedGoal:
        for item in stateSpaceTree[-1]:
            i, j = find_zero(item["data"])
            performAction(item, i, j, 'l')
            performAction(item, i, j, 'r')
            performAction(item, i, j, 'u')
            performAction(item, i, j, 'd')

        stateSpaceTree.append(tempChildren)
        tempChildren = []
    
    for step,state in enumerate(stateSpaceTree):
        for item in state:
            print(step,item)
    for state in stateSpaceTree:
        for item in state:
            data = item["data"]
            getColor = 'green' if item["isGoal"] else ('red' if item["isRecursive"] else 'blue')
            tree.node(str(item["id"]), f"{data[0][0]}|{data[0][1]}|{data[0][2]}\n{data[1][0]}|{data[1][1]}|{data[1][2]}\n{data[2][0]}|{data[2][1]}|{data[2][2]}", color =getColor)
            if item["parentId"] != '':
                tree.edge(str(item["parentId"]), str(item["id"]), label = str(item["action"]))
    tree.render('test-output/8PuzzleBFS.gv', view=True)
    

def main():
    stateSpaceSearch()

if __name__ == "__main__":
    main()