import React, { useMemo, useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
} from "recharts"
import { useTaskQueries } from "../../../queries/tasks"
import useAuth from "hooks/useAuth"
import CrmSpinner from "components/CrmSpinner"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

const PRIORITY_COLORS = {
  High: "#ef4444",
  Medium: "#f59e0b",
  Low: "#10b981",
  მაღალი: "#ef4444",
  საშუალო: "#f59e0b",
  დაბალი: "#10b981",
}

const PRIORITY_TRANSLATIONS = {
  High: "მაღალი",
  Medium: "საშუალო",
  Low: "დაბალი",
}

const STATUS_TRANSLATIONS = {
  Completed: "დასრულებული",
  Pending: "მომლოდინე",
  "In Progress": "მიმდინარე",
}

const DUE_RANGE_TRANSLATIONS = {
  overdue: "ვადაგასული",
  thisWeek: "ამ კვირაში",
  thisMonth: "ამ თვეში",
  later: "მოგვიანებით",
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0]

    // For Tasks by Type chart with assignee details
    if (data.payload.assigneeStats) {
      return (
        <div className="bg-white dark:!bg-gray-800 p-3 border border-gray-200 dark:!border-gray-700 rounded-lg shadow-lg">
          <p className="text-gray-900 dark:!text-gray-100 font-medium mb-2">
            {label}
          </p>
          <p
            className="text-sm dark:!text-gray-200"
            style={{ color: data.color || data.fill }}
          >
            სულ დავალებები: {data.value}
          </p>
          <div className="mt-2">
            {Object.entries(data.payload.assigneeStats).map(([name, stats]) => (
              <p key={name} className="text-sm dark:!text-gray-200">
                {name}: {stats.completed}/{stats.total}
              </p>
            ))}
          </div>
        </div>
      )
    }

    // For other charts
    return (
      <div className="bg-white dark:!bg-gray-800 p-3 border border-gray-200 dark:!border-gray-700 rounded-lg shadow-lg">
        <p className="text-gray-900 dark:!text-gray-100 font-medium">
          {STATUS_TRANSLATIONS[label] ||
            PRIORITY_TRANSLATIONS[label] ||
            DUE_RANGE_TRANSLATIONS[label] ||
            label}
        </p>
        {payload.map((entry, index) => (
          <p
            key={index}
            className="text-sm dark:!text-gray-200"
            style={{ color: entry.color || entry.fill }}
          >
            {`${
              entry.name === "hours"
                ? "საათები"
                : entry.name === "count"
                ? "რაოდენობა"
                : entry.name === "completionRate"
                ? "დასრულების %"
                : entry.name === "tasks"
                ? "დავალებები"
                : entry.name === "commentCount"
                ? "კომენტარები"
                : entry.name
            }: ${entry.value}`}
          </p>
        ))}
      </div>
    )
  }
  return null
}

const TaskCharts = () => {
  const { isITDepartment, isAdmin } = useAuth()
  const { tasksList, isTasksListLoading } = useTaskQueries(
    isITDepartment,
    isAdmin
  )
  const [timeRange, setTimeRange] = useState("month")

  const taskData = useMemo(() => {
    if (!tasksList?.data) return []

    const now = new Date()
    const data = tasksList.data

    return data.filter(task => {
      const taskDate = new Date(task.created_at)
      const diffTime = Math.abs(now - taskDate)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      switch (timeRange) {
        case "week":
          return diffDays <= 7
        case "month":
          return diffDays <= 30
        case "year":
          return diffDays <= 365
        default:
          return true
      }
    })
  }, [tasksList?.data, timeRange])

  const tasksByStatus = useMemo(() => {
    const statusCount = taskData.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1
      return acc
    }, {})

    return Object.entries(statusCount).map(([name, value]) => ({
      name,
      value,
    }))
  }, [taskData])

  const tasksByPriority = useMemo(() => {
    const priorityCount = taskData.reduce((acc, task) => {
      const georgianPriority = PRIORITY_TRANSLATIONS[task.priority]
      acc[georgianPriority] = (acc[georgianPriority] || 0) + 1
      return acc
    }, {})

    return Object.entries(priorityCount).map(([name, value]) => ({
      name,
      value,
      color: PRIORITY_COLORS[name],
    }))
  }, [taskData])

  const tasksByAssignee = useMemo(() => {
    const assigneeCount = {}
    taskData.forEach(task => {
      task.assigned_users?.forEach(user => {
        const userName = `${user.name} ${user.sur_name}`
        assigneeCount[userName] = (assigneeCount[userName] || 0) + 1
      })
    })

    return Object.entries(assigneeCount)
      .map(([name, tasks]) => ({
        name,
        tasks,
      }))
      .sort((a, b) => b.tasks - a.tasks)
  }, [taskData])

  const taskCompletionTrend = useMemo(() => {
    const sortedTasks = [...taskData].sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    )

    let completed = 0
    let total = 0

    return sortedTasks.map(task => {
      total++
      if (task.status === "Completed") {
        completed++
      }
      return {
        date: new Date(task.created_at).toLocaleDateString(),
        completionRate: (completed / total) * 100,
      }
    })
  }, [taskData])

  const averageCompletionTime = useMemo(() => {
    const completedTasks = taskData.filter(task => task.status === "Completed")
    const timesByPriority = completedTasks.reduce((acc, task) => {
      const created = new Date(task.created_at)
      const updated = new Date(task.updated_at)
      const hours = (updated - created) / (1000 * 60 * 60)

      const priority = PRIORITY_TRANSLATIONS[task.priority]
      if (!acc[priority]) {
        acc[priority] = { total: 0, count: 0 }
      }
      acc[priority].total += hours
      acc[priority].count++
      return acc
    }, {})

    return Object.entries(timesByPriority).map(([priority, data]) => ({
      priority,
      hours: data.total / data.count,
      color: PRIORITY_COLORS[priority],
    }))
  }, [taskData])

  const tasksByDueRange = useMemo(() => {
    const now = new Date()
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    const monthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

    const ranges = {
      overdue: 0,
      thisWeek: 0,
      thisMonth: 0,
      later: 0,
    }

    taskData.forEach(task => {
      if (!task.due_date) return

      const dueDate = new Date(task.due_date)
      if (dueDate < now) ranges.overdue++
      else if (dueDate <= weekFromNow) ranges.thisWeek++
      else if (dueDate <= monthFromNow) ranges.thisMonth++
      else ranges.later++
    })

    return Object.entries(ranges).map(([range, count]) => ({
      range,
      count,
      name: DUE_RANGE_TRANSLATIONS[range],
    }))
  }, [taskData])

  const tasksByDepartment = useMemo(() => {
    const departmentCount = taskData.reduce((acc, task) => {
      const department = task.user?.department?.name || "უცნობი"
      acc[department] = (acc[department] || 0) + 1
      return acc
    }, {})

    return Object.entries(departmentCount)
      .map(([name, count]) => ({
        name,
        count,
      }))
      .sort((a, b) => b.count - a.count)
  }, [taskData])

  const commentsActivity = useMemo(() => {
    return taskData
      .map(task => ({
        taskId: task.id,
        commentCount: task.comments?.length || 0,
        taskTitle: task.task_title,
      }))
      .filter(task => task.commentCount > 0)
      .sort((a, b) => b.commentCount - a.commentCount)
      .slice(0, 10)
  }, [taskData])

  const tasksByType = useMemo(() => {
    const typeCount = taskData.reduce((acc, task) => {
      const type = task.task_title
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {})

    return Object.entries(typeCount)
      .map(([name, value]) => {
        const tasksOfThisType = taskData.filter(
          task => task.task_title === name
        )
        const assigneeStats = {}

        tasksOfThisType.forEach(task => {
          task.assigned_users?.forEach(user => {
            const userName = `${user.name} ${user.sur_name}`
            if (!assigneeStats[userName]) {
              assigneeStats[userName] = { total: 0, completed: 0 }
            }
          })
        })

        Object.keys(assigneeStats).forEach(userName => {
          tasksOfThisType.forEach(task => {
            const isAssignedToUser = task.assigned_users?.some(
              user => `${user.name} ${user.sur_name}` === userName
            )
            if (isAssignedToUser) {
              assigneeStats[userName].total++
              if (task.status === "Completed") {
                assigneeStats[userName].completed++
              }
            }
          })
        })

        return {
          name,
          value,
          assigneeStats,
        }
      })
      .sort((a, b) => b.value - a.value)
  }, [taskData])

  const chartAxisStyle = {
    className: "text-gray-700 dark:!text-gray-300",
    tick: { fill: "currentColor" },
    axisLine: { stroke: "currentColor" },
  }

  if (isTasksListLoading) {
    return <CrmSpinner />
  }

  return (
    <div className="max-w-full mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-8 bg-white dark:!bg-gray-900">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:!text-white">
          დავალებების ანალიტიკა
        </h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg transition-all ${
              timeRange === "week"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:!bg-gray-700 text-gray-700 dark:!text-gray-200 hover:bg-gray-300 dark:!hover:bg-gray-600"
            }`}
            onClick={() => setTimeRange("week")}
          >
            კვირა
          </button>
          <button
            className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg transition-all ${
              timeRange === "month"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:!bg-gray-700 text-gray-700 dark:!text-gray-200 hover:bg-gray-300 dark:!hover:bg-gray-600"
            }`}
            onClick={() => setTimeRange("month")}
          >
            თვე
          </button>
          <button
            className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg transition-all ${
              timeRange === "year"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:!bg-gray-700 text-gray-700 dark:!text-gray-200 hover:bg-gray-300 dark:!hover:bg-gray-600"
            }`}
            onClick={() => setTimeRange("year")}
          >
            წელი
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
        {/* Task Creation Timeline */}
        <div className="bg-white dark:!bg-gray-800 p-3 sm:p-6 rounded-xl shadow-lg col-span-1 lg:col-span-2">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-900 dark:!text-white">
            დავალებების შექმნის დინამიკა
          </h2>
          <div className="h-[300px] sm:h-[400px] w-full">
            <ResponsiveContainer>
              <ComposedChart data={taskCompletionTrend}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-gray-300 dark:!stroke-gray-600"
                />
                <XAxis
                  dataKey="date"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  {...chartAxisStyle}
                />
                <YAxis {...chartAxisStyle} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: "currentColor" }} />
                <Area
                  type="monotone"
                  dataKey="completionRate"
                  fill="#8884d8"
                  stroke="#8884d8"
                  fillOpacity={0.3}
                  name="დასრულების მაჩვენებელი"
                />
                <Line
                  type="monotone"
                  dataKey="completionRate"
                  stroke="#82ca9d"
                  name="ტრენდი"
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Status Distribution */}
        <div className="bg-white dark:!bg-gray-800 p-3 sm:p-6 rounded-xl shadow-lg">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-900 dark:!text-white">
            დავალებების სტატუსები
          </h2>
          <div className="h-[300px] sm:h-[400px] w-full">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={tasksByStatus.map(item => ({
                    ...item,
                    name: STATUS_TRANSLATIONS[item.name] || item.name,
                  }))}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label
                >
                  {tasksByStatus.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: "currentColor" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tasks by Priority */}
        <div className="bg-white dark:!bg-gray-800 p-3 sm:p-6 rounded-xl shadow-lg">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-900 dark:!text-white">
            დავალებები პრიორიტეტის მიხედვით
          </h2>
          <div className="h-[300px] sm:h-[400px] w-full">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={tasksByPriority}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label
                >
                  {tasksByPriority.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: "currentColor" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Average Completion Time by Priority */}
        <div className="bg-white dark:!bg-gray-800 p-3 sm:p-6 rounded-xl shadow-lg">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-900 dark:!text-white">
            საშუალო შესრულების დრო პრიორიტეტის მიხედვით
          </h2>
          <div className="h-[300px] sm:h-[400px] w-full">
            <ResponsiveContainer>
              <BarChart data={averageCompletionTime}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-gray-300 dark:!stroke-gray-600"
                />
                <XAxis dataKey="priority" {...chartAxisStyle} />
                <YAxis {...chartAxisStyle} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: "currentColor" }} />
                <Bar dataKey="hours" name="საათები">
                  {averageCompletionTime.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tasks by Due Range */}
        <div className="bg-white dark:!bg-gray-800 p-3 sm:p-6 rounded-xl shadow-lg">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-900 dark:!text-white">
            დავალებები ვადების მიხედვით
          </h2>
          <div className="h-[300px] sm:h-[400px] w-full">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={tasksByDueRange}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label
                >
                  {tasksByDueRange.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: "currentColor" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tasks by Type */}
        <div className="bg-white dark:!bg-gray-800 p-3 sm:p-6 rounded-xl shadow-lg col-span-1 lg:col-span-2">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-900 dark:!text-white">
            დავალებები ტიპის მიხედვით
          </h2>
          <div className="h-[300px] sm:h-[400px] w-full">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={tasksByType}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label
                >
                  {tasksByType.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: "currentColor" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tasks by Department */}
        <div className="bg-white dark:!bg-gray-800 p-3 sm:p-6 rounded-xl shadow-lg col-span-1 lg:col-span-2">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-900 dark:!text-white">
            დავალებები დეპარტამენტების მიხედვით
          </h2>
          <div className="h-[300px] sm:h-[400px] w-full">
            <ResponsiveContainer>
              <BarChart data={tasksByDepartment}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-gray-300 dark:!stroke-gray-600"
                />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  {...chartAxisStyle}
                />
                <YAxis {...chartAxisStyle} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: "currentColor" }} />
                <Bar
                  dataKey="count"
                  fill="#8884d8"
                  name="დავალებების რაოდენობა"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tasks by Assignee */}
        <div className="bg-white dark:!bg-gray-800 p-3 sm:p-6 rounded-xl shadow-lg col-span-1 lg:col-span-2">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-900 dark:!text-white">
            დავალებები თანამშრომლების მიხედვით
          </h2>
          <div className="h-[300px] sm:h-[400px] w-full">
            <ResponsiveContainer>
              <BarChart data={tasksByAssignee}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-gray-300 dark:!stroke-gray-600"
                />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  {...chartAxisStyle}
                />
                <YAxis {...chartAxisStyle} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: "currentColor" }} />
                <Bar dataKey="tasks" fill="#82ca9d" name="დავალებები" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Most Commented Tasks */}
        <div className="bg-white dark:!bg-gray-800 p-3 sm:p-6 rounded-xl shadow-lg col-span-1 lg:col-span-2">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-900 dark:!text-white">
            ყველაზე აქტიური დავალებები (კომენტარების მიხედვით)
          </h2>
          <div className="h-[300px] sm:h-[400px] w-full">
            <ResponsiveContainer>
              <BarChart data={commentsActivity}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-gray-300 dark:!stroke-gray-600"
                />
                <XAxis
                  dataKey="taskTitle"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  {...chartAxisStyle}
                />
                <YAxis {...chartAxisStyle} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: "currentColor" }} />
                <Bar
                  dataKey="commentCount"
                  fill="#8884d8"
                  name="კომენტარების რაოდენობა"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskCharts
