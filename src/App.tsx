import {
  Alert,
  AlertTitle,
  Autocomplete,
  Box,
  Card,
  Chip,
  TextField,
  Typography,
} from "@mui/material";
import { useRef, useState } from "react";

const operators = ["+", "-", "*", "/", "(", ")"];

const suggestions = [
  { label: "fees", value: 50.2 },
  { label: "payment", value: 10.947 },
  { label: "fees payment", value: 347.54 },
  { label: "purchase", value: 60.0 },
  { label: "fees paid", value: 54.87 },
  { label: "payment completed", value: 68.1 },
  { label: "item purchase", value: 987.93 },
];

const errorMessage = "Please enter valid arithmetic expression.";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [value, setValue] = useState<string[]>([]);
  const [calculation, setCalculation] = useState(0.0);
  const [isError, setIsError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateArithmaticEquation = (labels: string[]) => {
    const operandsLabels = labels.filter(
      (label, i) =>
        i % 2 === 0 && Boolean(suggestions.filter((x) => x.label === label)[0])
    );
    const operatorLabels = labels.filter(
      (label, i) => i % 2 === 1 && operators.includes(label)
    );
    const totalValidateLength = operandsLabels.length + operatorLabels.length;
    return totalValidateLength === labels.length;
  };

  const findLabelValue = (labels: string[]) => {
    const operationString = labels.map((label) => {
      if (operators.includes(label))
        return operators.filter((x) => x === label)[0];

      return suggestions.filter((x) => x.label === label)[0]?.value ?? 0;
    });

    return operationString.join(" ");
  };

  const handleInputChange = (val: string) => {
    const isArith = operators.includes(val);

    if (isArith && inputRef.current) {
      setValue([...value, val]);
      setInputValue("");
    } else {
      setInputValue(val);
    }
  };

  const arithmeticOperation = (operationString: string) => {
    try {
      // eslint-disable-next-line no-new-func
      return new Function("return " + operationString)();
    } catch {
      return "";
    }
  };

  const handleAutoCompleteChange = (event: any, newValue: string[]) => {
    setValue(newValue);

    if (!validateArithmaticEquation(newValue)) {
      setIsError(true);
      return;
    }

    const operationString = findLabelValue(newValue);
    const operation = arithmeticOperation(operationString);
    if (operation) setCalculation(operation);
    setIsError(false);
  };

  return (
    <Box p={4} display="flex" alignItems="center" justifyContent="center">
      <Box maxWidth={800} width="100%">
        <Card
          variant="outlined"
          sx={{ p: 4, display: "flex", flexDirection: "column", gap: 3 }}
        >
          <Typography textAlign="center" variant="h4">
            Test
          </Typography>
          <Autocomplete
            multiple
            id="tags-filled"
            options={suggestions.map((option) => option.label)}
            freeSolo
            value={value}
            onChange={handleAutoCompleteChange}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) =>
              handleInputChange(newInputValue)
            }
            renderTags={(value: readonly string[], getTagProps) =>
              value.map((option: string, index: number) => (
                <Chip
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                  className={
                    operators.includes(value[index]) ? "arithmetic" : ""
                  }
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="filled"
                label="test"
                placeholder="test"
                ref={inputRef}
              />
            )}
            sx={{
              "& .arithmetic": {
                border: "none",
                "& .MuiChip-deleteIcon": {
                  display: "none",
                },
              },
            }}
          />
          {isError && (
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              {errorMessage}
            </Alert>
          )}
          <Box>
            <Typography variant="h6">
              <Box component="strong">Total: </Box>
              {calculation.toFixed(2)}
            </Typography>
          </Box>
        </Card>
      </Box>
    </Box>
  );
}

export default App;
