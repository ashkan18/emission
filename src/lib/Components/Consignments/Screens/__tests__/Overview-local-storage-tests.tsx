import { AsyncStorage } from "react-native"

import Overview from "../Overview"

AsyncStorage.setItem = jest.fn()
AsyncStorage.getItem = jest.fn()
AsyncStorage.removeItem = jest.fn()

jest.mock("../../Submission/create", () => jest.fn())
jest.mock("../../Submission/update", () => jest.fn())

beforeEach(() => {
  jest.resetAllMocks()
})

const key = "ConsignmentsStoredState"

it("restores when no props are provided", () => {
  // tslint:disable-next-line
  new Overview({ setup: null })
  expect(AsyncStorage.getItem).toBeCalledWith(key, expect.anything())
})

it("does not restore setup props are provided", () => {
  // tslint:disable-next-line
  new Overview({ setup: {} })
  expect(AsyncStorage.getItem).not.toBeCalled()
})

it("updates the local state when there an update is triggered", () => {
  const overview = new Overview({ setup: {} })

  overview.setState = (updated, callback) => {
    overview.state = Object.assign({}, overview.state, updated)
    callback()
  }

  overview.updateProvenance("This is a new provenance")

  expect(AsyncStorage.setItem).toBeCalledWith(
    "ConsignmentsStoredState",
    JSON.stringify({ provenance: "This is a new provenance" })
  )
})

it("resets the cache when a final submission is made", async () => {
  const overview = new Overview({ setup: {} })
  overview.uploadPhotosIfNeeded = () => Promise.resolve()
  overview.showConfirmationScreen = () => true

  // Expect the state to get called, and replicate the behavior
  overview.setState = (_, callback) => {
    callback()
  }

  // Make a call to the
  await overview.submitFinalSubmission({ signed: true })

  expect(AsyncStorage.removeItem).toBeCalledWith(key)
})
